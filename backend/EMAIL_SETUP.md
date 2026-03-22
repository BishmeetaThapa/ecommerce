# Email Setup Guide

This document explains how to configure email functionality for the EverGlow E-Commerce platform.

## Overview

The backend uses **Nodemailer** to send emails for:
- Password reset emails
- Welcome emails for new users

## Prerequisites

- Node.js installed
- An email account (Gmail, Outlook, Yahoo, or Mailtrap for testing)

## Installation

The `nodemailer` package is already installed. If you need to reinstall:

```bash
cd backend
npm install nodemailer
```

## Configuration

### 1. Environment Variables

Edit the `backend/.env` file and add your email credentials:

#### Option A: Gmail (Recommended)

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="EverGlow Beauty" <noreply@everglow.com>
```

**Important:** For Gmail, you must use an **App Password**, not your regular password:
1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Search for "App Passwords" in the search bar
4. Create a new app password for "Mail"
5. Use the generated 16-character password in `EMAIL_PASS`

#### Option B: Mailtrap (For Testing)

```env
# Email Configuration (Mailtrap - for testing)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM="EverGlow Beauty" <noreply@everglow.com>
```

Sign up for free at [mailtrap.io](https://mailtrap.io)

#### Option C: Other Email Providers

| Provider | SMTP Host | Port (TLS) | Port (SSL) |
|----------|-----------|------------|------------|
| Outlook | smtp-mail.outlook.com | 587 | - |
| Yahoo | smtp.mail.yahoo.com | 587 | 465 |
| Office 365 | smtp.office365.com | 587 | - |

### 2. Frontend URL

Ensure the frontend URL is set correctly:

```env
FRONTEND_URL=http://localhost:3000
```

This is used to generate password reset links.

## How It Works

### Development Mode

If email credentials are not configured or are invalid:
- Password reset links are logged to the console
- The system still works but doesn't send actual emails
- A warning is shown: `⚠️ Email configuration not found. Emails will be logged only.`

### Production Mode

When properly configured:
- Emails are sent via SMTP
- Users receive professional HTML emails
- No sensitive data is logged

## Testing the Email System

### 1. Start the backend server

```bash
cd backend
npm run dev
```

### 2. Test Password Reset

Send a POST request to the forgot-password endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your_email@gmail.com"}'
```

**Expected Response:**
- If configured: Email is sent, check your inbox
- If not configured: Check the backend console for the reset link

### 3. Check Console Output

When email is not configured, you'll see:

```
⚠️  Email configuration not found. Emails will be logged only.
📧 [DEV MODE] Password Reset Email:
   To: your_email@gmail.com
   Link: http://localhost:3000/reset-password?token=xxx
```

## Email Templates

### Password Reset Email

The system sends a professional HTML email with:
- EverGlow Beauty branding
- Gradient header
- Password reset button
- Expiration notice (1 hour)
- Security disclaimer

### Welcome Email

New users receive a welcome email with:
- Personalized greeting
- EverGlow Beauty branding
- Call-to-action button to shop

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - For Gmail: Make sure you're using an App Password, not your regular password
   - Check that 2-Step Verification is enabled on your Google Account

2. **"Connection timeout"**
   - Check that the port number is correct (587 for TLS, 465 for SSL)
   - Check your firewall settings

3. **Emails not sending**
   - Verify credentials in `.env` file
   - Check the backend console for error messages
   - Ensure the `.env` file is saved correctly

4. **Reset link not working**
   - Make sure `FRONTEND_URL` matches your frontend address
   - Check that the token hasn't expired (1 hour validity)

### Debug Mode

To see detailed email sending logs, you can add debug logging:

```javascript
// In backend/src/utils/email.js, temporarily add:
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Verification Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});
```

## Security Notes

1. **Never commit credentials** - The `.env` file is in `.gitignore`
2. **Use App Passwords** for Gmail - Regular passwords won't work
3. **Validate emails** - The API returns generic messages to prevent email enumeration
4. **Token expiry** - Reset tokens expire after 1 hour for security

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/register` | POST | Register new user (sends welcome email) |

---

For any issues or questions, check the console output or the main README.md for project documentation.
