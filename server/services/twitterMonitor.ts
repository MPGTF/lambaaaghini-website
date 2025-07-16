import { TwitterApi } from "twitter-api-v2";
import { TokenLaunchService } from "./tokenLaunch";

interface ProcessedTweet {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  mediaUrls?: string[];
  createdAt: string;
}

export class TwitterMonitorService {
  private twitterClient: TwitterApi;
  private tokenLauncher: TokenLaunchService;
  private processedTweets: Set<string> = new Set();
  private isMonitoring: boolean = false;

  constructor(
    twitterCredentials: {
      appKey: string;
      appSecret: string;
      accessToken: string;
      accessSecret: string;
    },
    tokenLauncher: TokenLaunchService,
  ) {
    this.twitterClient = new TwitterApi(twitterCredentials);
    this.tokenLauncher = tokenLauncher;
  }

  /**
   * Start monitoring Twitter for launch tweets
   */
  async startMonitoring() {
    if (this.isMonitoring) {
      console.log("Twitter monitoring already running");
      return;
    }

    this.isMonitoring = true;
    console.log("🐑 Starting Twitter monitoring for token launches...");

    // Start polling for mentions
    this.pollForMentions();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    console.log("🛑 Twitter monitoring stopped");
  }

  /**
   * Poll for mentions every 30 seconds
   */
  private async pollForMentions() {
    while (this.isMonitoring) {
      try {
        await this.checkForLaunchTweets();
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
      } catch (error) {
        console.error("Error during Twitter polling:", error);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute on error
      }
    }
  }

  /**
   * Check for new launch tweets
   */
  private async checkForLaunchTweets() {
    try {
      // Get your own user ID first
      const me = await this.twitterClient.v2.me();
      const myUserId = me.data.id;

      // Search for mentions in the last 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const mentions = await this.twitterClient.v2.search(
        `@${me.data.username} -is:retweet`,
        {
          "tweet.fields": ["created_at", "author_id", "attachments"],
          "user.fields": ["username"],
          "media.fields": ["url"],
          expansions: ["author_id", "attachments.media_keys"],
          start_time: twoMinutesAgo,
          max_results: 10,
        },
      );

      if (!mentions.data || mentions.data.length === 0) {
        return;
      }

      // Process each mention
      for (const tweet of mentions.data) {
        if (this.processedTweets.has(tweet.id)) {
          continue; // Skip already processed tweets
        }

        const author = mentions.includes?.users?.find(
          (user) => user.id === tweet.author_id,
        );

        if (!author) continue;

        const processedTweet: ProcessedTweet = {
          id: tweet.id,
          text: tweet.text,
          authorId: tweet.author_id!,
          authorUsername: author.username,
          createdAt: tweet.created_at!,
        };

        // Extract media URLs if present
        if (tweet.attachments?.media_keys && mentions.includes?.media) {
          processedTweet.mediaUrls = mentions.includes.media
            .filter((media) =>
              tweet.attachments!.media_keys!.includes(media.media_key!),
            )
            .map((media) => media.url!)
            .filter(Boolean);
        }

        await this.processTweetForLaunch(processedTweet);
        this.processedTweets.add(tweet.id);
      }
    } catch (error) {
      console.error("Error checking for launch tweets:", error);
    }
  }

  /**
   * Process a tweet to potentially launch a token
   */
  private async processTweetForLaunch(tweet: ProcessedTweet) {
    try {
      console.log(
        `🐑 Processing tweet from @${tweet.authorUsername}: ${tweet.text}`,
      );

      // Parse tweet for token info
      const tokenInfo = TokenLaunchService.parseTweetForToken(tweet.text);

      if (!tokenInfo) {
        console.log("❌ Tweet doesn't match token launch format");
        await this.replyToTweet(
          tweet.id,
          `🐑 Hey @${tweet.authorUsername}! To launch a token, use this format:\n\n"TOKEN NAME + TICKER"\n\nExample: "Super Sheep + SHEEP"\n\nAdd an image for your token logo! 🚗💨`,
        );
        return;
      }

      console.log(
        `✅ Found token launch request: ${tokenInfo.name} (${tokenInfo.symbol})`,
      );

      // Reply with processing message
      await this.replyToTweet(
        tweet.id,
        `🐑🚗 Launching ${tokenInfo.name} ($${tokenInfo.symbol})...\n\nProcessing your token launch! This may take a moment... ⏳`,
      );

      // Extract image if present
      let imageBuffer: Buffer | undefined;
      let imageName: string | undefined;

      if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
        const imageData = await TokenLaunchService.extractImageFromTweet(
          tweet.mediaUrls[0],
        );
        if (imageData) {
          imageBuffer = imageData.buffer;
          imageName = imageData.name;
        }
      }

      // Launch the token
      const launchResult = await this.tokenLauncher.createToken({
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        description: `${tokenInfo.name} - Launched via LAMBAAAGHINI Tweet-to-Launch by @${tweet.authorUsername}! 🐑🚗`,
        twitter: `https://twitter.com/${tweet.authorUsername}`,
        imageBuffer,
        imageName,
      });

      // Reply with results
      if (launchResult.success) {
        const pumpFunUrl = `https://pump.fun/${launchResult.mintAddress}`;
        const dexScreenerUrl = `https://dexscreener.com/solana/${launchResult.mintAddress}`;

        await this.replyToTweet(
          tweet.id,
          `🎉 ${tokenInfo.name} ($${tokenInfo.symbol}) launched successfully!\n\n📍 Contract: ${launchResult.mintAddress}\n\n🔗 Trade on Pump.fun: ${pumpFunUrl}\n\n📊 DexScreener: ${dexScreenerUrl}\n\n#LAMBAAAGHINI #SheepMeetSupercars 🐑🚗`,
        );

        console.log(
          `🎉 Token ${tokenInfo.symbol} launched successfully: ${launchResult.mintAddress}`,
        );
      } else {
        await this.replyToTweet(
          tweet.id,
          `❌ Failed to launch ${tokenInfo.name} ($${tokenInfo.symbol})\n\nError: ${launchResult.error}\n\nPlease try again! 🐑`,
        );

        console.log(`❌ Token launch failed: ${launchResult.error}`);
      }
    } catch (error) {
      console.error("Error processing tweet for launch:", error);
      await this.replyToTweet(
        tweet.id,
        `❌ Something went wrong processing your token launch!\n\nPlease try again in a few minutes. 🐑`,
      );
    }
  }

  /**
   * Reply to a tweet
   */
  private async replyToTweet(tweetId: string, message: string) {
    try {
      await this.twitterClient.v2.reply(message, tweetId);
      console.log(`✅ Replied to tweet ${tweetId}`);
    } catch (error) {
      console.error(`❌ Failed to reply to tweet ${tweetId}:`, error);
    }
  }

  /**
   * Get processing status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      processedTweetsCount: this.processedTweets.size,
    };
  }
}
