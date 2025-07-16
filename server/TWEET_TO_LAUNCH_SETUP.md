# Tweet-to-Launch Setup Guide

## Overview

The Tweet-to-Launch feature allows users to create tokens on pump.fun by simply tweeting with a specific format. The system monitors Twitter for mentions and automatically deploys tokens.

## Prerequisites

### 1. Twitter API Credentials

You need the same Twitter API credentials used for the marketing proposals:

- API Key
- API Secret
- Access Token: `1943383803029807104-vTc7X1Z5taiBmpQmfDqUlTmw9QFtlZ`
- Access Secret: `tP3qiWrCOg7bngetiVqoCwHgr1nHmN0wcrvbhtHFxo8wF`

### 2. Solana Wallet for Token Creation

You need a funded Solana wallet to pay for token creation fees:

- Private key in base58 format
- Wallet should have ~0.1 SOL for each token creation
- Each token creation costs ~0.02 SOL + dev buy amount

### 3. Required Environment Variables

Add these to your `.env` file:

```bash
# Twitter API (same as before)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=1943383803029807104-vTc7X1Z5taiBmpQmfDqUlTmw9QFtlZ
TWITTER_ACCESS_SECRET=tP3qiWrCOg7bngetiVqoCwHgr1nHmN0wcrvbhtHFxo8wF

# Solana Wallet for Token Creation
SOLANA_PRIVATE_KEY=your_base58_private_key_here
SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your_key_here
```

## How It Works

### 1. Tweet Format

Users tweet in this format:

- `"TOKEN NAME + TICKER"`
- `"TOKEN NAME $TICKER"`
- `"TOKEN NAME TICKER"`

Examples:

- `"Super Sheep + SHEEP"`
- `"Moon Lambs $MLAMB"`
- `"Fast Cars FCAR"`

### 2. Optional Image

Users can attach an image to their tweet which becomes the token logo.

### 3. Automatic Processing

1. System monitors Twitter for mentions every 30 seconds
2. Parses tweets for valid token format
3. Extracts image if present
4. Uploads metadata to IPFS via pump.fun
5. Creates token via PumpSwapApi
6. Replies with contract address and trading links

## API Endpoints

### Start Monitoring

```bash
POST /api/tweet-launch/start-monitoring
```

### Stop Monitoring

```bash
POST /api/tweet-launch/stop-monitoring
```

### Get Status

```bash
GET /api/tweet-launch/status
```

### Test Parsing

```bash
POST /api/tweet-launch/test-parse
Body: { "tweetText": "Super Sheep + SHEEP" }
```

### Manual Launch (Testing)

```bash
POST /api/tweet-launch/manual-launch
Body: {
  "name": "Test Token",
  "symbol": "TEST",
  "description": "Test description",
  "imageUrl": "https://example.com/image.png"
}
```

## Security Considerations

1. **Private Key Storage**: Store Solana private key securely in environment variables
2. **Rate Limiting**: Twitter API has rate limits - monitor usage
3. **Wallet Funding**: Keep wallet funded for token creation fees
4. **Error Handling**: System handles errors gracefully and replies to users

## Important Notes

### Token Creation Costs

- Base creation fee: ~0.01-0.02 SOL
- Optional dev buy: configurable (default 0.01 SOL)
- Total per token: ~0.02-0.03 SOL

### Rate Limits

- Twitter API: 300 requests per 15 minutes
- Pump.fun: No official limits but recommend spacing requests

### Monitoring Frequency

- Current: Every 30 seconds
- Processes last 2 minutes of mentions
- Stores processed tweet IDs to avoid duplicates

## Frontend Interface

Users can access the Tweet-to-Launch interface at `/tweet-to-launch` which provides:

- Instructions on how to use the feature
- Tweet format testing
- Monitoring status
- Manual launch capability (admin)

## Troubleshooting

### Common Issues

1. **Twitter auth fails**: Check API credentials
2. **Token creation fails**: Check wallet funding
3. **Image upload fails**: Images must be accessible publicly
4. **Monitoring stops**: Restart via API or frontend

### Logs

Check server logs for detailed error messages and processing status.
