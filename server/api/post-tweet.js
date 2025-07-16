// Backend API endpoint for posting to Twitter
// This should run on your server, NOT in the frontend

const express = require("express");
const { TwitterApi } = require("twitter-api-v2");
const router = express.Router();

// Initialize Twitter client with your credentials
// NEVER put these in frontend code!
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: "1943383803029807104-vTc7X1Z5taiBmpQmfDqUlTmw9QFtlZ",
  accessSecret: "tP3qiWrCOg7bngetiVqoCwHgr1nHmN0wcrvbhtHFxo8wF",
});

// POST endpoint to create a tweet
router.post("/post-tweet", async (req, res) => {
  try {
    const { tweetText, proposalData } = req.body;

    // Validate request
    if (!tweetText || !proposalData) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Post to Twitter
    const tweet = await twitterClient.v2.tweet(tweetText);

    // Log the proposal for record keeping
    console.log("Posted marketing proposal:", {
      tweetId: tweet.data.id,
      company: proposalData.company,
      email: proposalData.email,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      tweetId: tweet.data.id,
      tweetUrl: `https://twitter.com/YourHandle/status/${tweet.data.id}`,
    });
  } catch (error) {
    console.error("Twitter posting failed:", error);
    res.status(500).json({
      error: "Failed to post tweet",
      details: error.message,
    });
  }
});

module.exports = router;
