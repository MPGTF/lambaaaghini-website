# Email Setup for Marketing Proposals

## Overview

Marketing proposal submissions are now automatically emailed to `lambaaaghini@gmail.com` with all form data beautifully formatted in HTML.

## Setup Requirements

### 1. Gmail Configuration

You need to set up Gmail App Passwords to send emails securely:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration for Marketing Proposals
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Important:**

- Use the Gmail account that should send the emails
- Use the 16-character App Password, NOT your regular Gmail password
- Keep these credentials secure and never commit them to version control

### 3. Test Connection

You can test the email connection using the API endpoint:

```bash
GET /api/email/test-connection
```

This will verify if the email service can connect to Gmail successfully.

## How It Works

### 1. Automatic Email Sending

When a user submits a marketing proposal:

1. Form data is processed on the frontend
2. Payment is attempted (if wallet connected)
3. Proposal is posted to Twitter/X (if no payment)
4. **Email is sent to lambaaaghini@gmail.com** with all proposal details
5. User receives confirmation

### 2. Email Content

The email includes:

- **Payment Status**: Whether 0.1 SOL was paid or not
- **Contact Information**: Name, email, company, social handles
- **Proposal Details**: Title, type, description, budget, timeline
- **Marketing Channels**: Planned channels and strategies
- **Timeline & Deliverables**: Project timeline and expected outcomes
- **Additional Info**: Previous work, why LAMBAAAGHINI, etc.

### 3. Email Format

- Professional HTML formatting
- Color-coded sections
- Payment status highlighting
- Reply-to set to submitter's email
- Timestamp and submission metadata

## API Endpoints

### Send Proposal Email

```bash
POST /api/email/send-proposal
```

**Body:**

```json
{
  "proposalData": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Marketing Agency"
    // ... all form fields
  },
  "paymentMade": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Marketing proposal email sent successfully"
}
```

### Test Email Connection

```bash
GET /api/email/test-connection
```

**Response:**

```json
{
  "success": true,
  "message": "Email service is working"
}
```

## Error Handling

- Email sending is non-blocking - if it fails, the proposal submission still succeeds
- Errors are logged but don't affect user experience
- Frontend shows success regardless of email status
- Email failures are logged on the server for monitoring

## Security Features

- App passwords instead of regular passwords
- Environment variable protection
- Reply-to header set to submitter for easy responses
- No sensitive data exposed in logs
- Secure Gmail SMTP connection

## Benefits

1. **Immediate Notifications**: Get proposals instantly in your inbox
2. **Professional Format**: Clean, readable HTML emails
3. **Complete Data**: All form fields included with proper formatting
4. **Easy Responses**: Reply directly to submitter's email
5. **Payment Tracking**: Clear indication of paid vs. free submissions
6. **Backup Record**: Email serves as permanent record of proposals

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**: Ensure EMAIL_USER and EMAIL_PASSWORD are set correctly
2. **Verify App Password**: Make sure you're using the 16-character App Password, not regular password
3. **Test Connection**: Use `/api/email/test-connection` to verify setup
4. **Check Logs**: Server logs will show detailed error messages
5. **Gmail Security**: Ensure 2FA is enabled and app password is generated

### Common Issues

- **"Invalid credentials"**: Wrong email or app password
- **"Connection timeout"**: Network or firewall issues
- **"Authentication failed"**: 2FA not enabled or wrong app password format

All marketing proposals will now be delivered directly to lambaaaghini@gmail.com! 🐑📧
