import express from "express";
import { TwitterMonitorService } from "../services/twitterMonitor";
import { TokenLaunchService } from "../services/tokenLaunch";
import { Keypair } from "@solana/web3.js";

const router = express.Router();

// Global monitor instance
let monitor: TwitterMonitorService | null = null;

// Initialize services
function initializeServices() {
  if (monitor) return monitor;

  // Twitter credentials
  const twitterCredentials = {
    appKey: process.env.TWITTER_API_KEY || "",
    appSecret: process.env.TWITTER_API_SECRET || "",
    accessToken:
      process.env.TWITTER_ACCESS_TOKEN ||
      "1943383803029807104-vTc7X1Z5taiBmpQmfDqUlTmw9QFtlZ",
    accessSecret:
      process.env.TWITTER_ACCESS_SECRET ||
      "tP3qiWrCOg7bngetiVqoCwHgr1nHmN0wcrvbhtHFxo8wF",
  };

  // Solana setup
  const rpcUrl =
    process.env.SOLANA_RPC_URL ||
    "https://solana-mainnet.g.alchemy.com/v2/demo";

  // Get wallet from environment variable or generate demo one
  let walletKeypair: Keypair;
  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      const privateKeyBytes = Buffer.from(
        process.env.SOLANA_PRIVATE_KEY,
        "base58",
      );
      walletKeypair = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
      console.warn("Invalid SOLANA_PRIVATE_KEY, using demo wallet");
      walletKeypair = Keypair.generate();
    }
  } else {
    console.warn("No SOLANA_PRIVATE_KEY provided, using demo wallet");
    walletKeypair = Keypair.generate();
  }

  // Initialize services
  const tokenLauncher = new TokenLaunchService(rpcUrl, walletKeypair.secretKey);

  monitor = new TwitterMonitorService(twitterCredentials, tokenLauncher);

  return monitor;
}

// Start monitoring endpoint
router.post("/start-monitoring", async (req, res) => {
  try {
    const monitorService = initializeServices();
    await monitorService.startMonitoring();

    res.json({
      success: true,
      message: "Twitter monitoring started for tweet-to-launch",
      status: monitorService.getStatus(),
    });
  } catch (error: any) {
    console.error("Failed to start monitoring:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start monitoring",
      details: error.message,
    });
  }
});

// Stop monitoring endpoint
router.post("/stop-monitoring", (req, res) => {
  try {
    if (monitor) {
      monitor.stopMonitoring();
    }

    res.json({
      success: true,
      message: "Twitter monitoring stopped",
    });
  } catch (error: any) {
    console.error("Failed to stop monitoring:", error);
    res.status(500).json({
      success: false,
      error: "Failed to stop monitoring",
      details: error.message,
    });
  }
});

// Get monitoring status
router.get("/status", (req, res) => {
  if (!monitor) {
    return res.json({
      isMonitoring: false,
      processedTweetsCount: 0,
      message: "Monitor not initialized",
    });
  }

  res.json(monitor.getStatus());
});

// Manual token launch endpoint (for testing)
router.post("/manual-launch", async (req, res) => {
  try {
    const { name, symbol, description, imageUrl } = req.body;

    if (!name || !symbol) {
      return res.status(400).json({
        success: false,
        error: "Name and symbol are required",
      });
    }

    const monitorService = initializeServices();
    const tokenLauncher = (monitorService as any).tokenLauncher;

    let imageBuffer: Buffer | undefined;
    let imageName: string | undefined;

    // Download image if URL provided
    if (imageUrl) {
      try {
        const imageData =
          await TokenLaunchService.extractImageFromTweet(imageUrl);
        if (imageData) {
          imageBuffer = imageData.buffer;
          imageName = imageData.name;
        }
      } catch (error) {
        console.warn("Failed to download image:", error);
      }
    }

    const result = await tokenLauncher.createToken({
      name,
      symbol: symbol.toUpperCase(),
      description,
      imageBuffer,
      imageName,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Manual launch failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to launch token",
      details: error.message,
    });
  }
});

// Test tweet parsing endpoint
router.post("/test-parse", (req, res) => {
  try {
    const { tweetText } = req.body;

    if (!tweetText) {
      return res.status(400).json({
        success: false,
        error: "Tweet text is required",
      });
    }

    const result = TokenLaunchService.parseTweetForToken(tweetText);

    res.json({
      success: true,
      input: tweetText,
      parsed: result,
      isValid: !!result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to parse tweet",
      details: error.message,
    });
  }
});

export { router as tweetLaunchRouter };
