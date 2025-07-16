# Twitter API Setup for LAMBAAAGHINI

## 🔐 SECURITY NOTICE

The Twitter API credentials you provided should NEVER be exposed in frontend code!

## Backend Setup

### 1. Install Dependencies

```bash
npm install twitter-api-v2 express
```

### 2. Environment Variables

Create a `.env` file in your server directory:

```bash
# Twitter API Credentials (keep these SECRET!)
TWITTER_ACCESS_TOKEN=1943383803029807104-vTc7X1Z5taiBmpQmfDqUlTmw9QFtlZ
TWITTER_ACCESS_SECRET=tP3qiWrCOg7bngetiVqoCwHgr1nHmN0wcrvbhtHFxo8wF

# You'll also need these from your Twitter Developer account:
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
```

### 3. Server Integration

Add this to your main server file:

```javascript
const express = require("express");
const tweetRouter = require("./api/post-tweet");

const app = express();
app.use(express.json());

// Add the Twitter API route
app.use("/api", tweetRouter);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
```

### 4. Frontend Configuration

Update your frontend to point to the correct backend URL:

```javascript
// In production, use your actual backend URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-domain.com"
    : "http://localhost:3001";

fetch(`${API_BASE_URL}/api/post-tweet`, {
  // ... rest of fetch call
});
```

## Security Checklist

- ✅ Credentials stored in environment variables
- ✅ Backend API endpoint created
- ✅ Frontend calls backend, not Twitter directly
- ✅ No credentials in frontend code
- ✅ Error handling implemented

## Testing

Test the endpoint with:

```bash
curl -X POST http://localhost:3001/api/post-tweet \
  -H "Content-Type: application/json" \
  -d '{"tweetText": "Test tweet from LAMBAAAGHINI! 🐑", "proposalData": {"company": "Test Corp", "email": "test@example.com"}}'
```

Remember: Keep your credentials secret and never commit them to version control!
