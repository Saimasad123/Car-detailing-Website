# REQUIRED: Gmail Setup for Email to Work

## Problem: "Error sending verification code"

This error happens because the email credentials are not set up correctly in `.env`

## Solution: Get Gmail App Password (3 Steps)

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Look for **"2-Step Verification"** 
3. Click it and follow steps to enable (if not already enabled)

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select dropdown: **"Mail"**
3. Select dropdown: **"Windows/Mac/Linux"**
4. Click **"Generate"**
5. Google will show a **16-character password** (like: `xxxx xxxx xxxx xxxx`)
6. **Copy this password** (with or without spaces)

### Step 3: Update .env File
1. Open `backend/.env` file
2. Find these lines:
   ```
   EMAIL_USER=luxe.shine.salon@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```
3. Replace with YOUR Gmail:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
   (Use the 16-character password from Step 2)

### Step 4: Restart Server
```bash
cd backend
npm start
```

## Try Again

Now try registering again - you should see:
- "Verification code sent to email" message
- Email arrives in your inbox with 6-digit code

## Troubleshooting

**Still getting error?**
- ✅ Make sure you copied the **16-character app password** (not regular password)
- ✅ Make sure **2-Factor authentication is enabled** on Gmail
- ✅ Make sure `.env` file has correct values
- ✅ Restart server after updating `.env`
- ✅ Check server console for detailed error messages

**Don't have Gmail?**
- You can use any email service that supports SMTP
- Edit `backend/utils/emailService.js` and change the service configuration
- Common services: Outlook, Yahoo, SendGrid, AWS SES

## Email Services Configuration

### Gmail (Default)
```javascript
service: 'gmail'
```

### Outlook / Hotmail
```javascript
service: 'outlook'
```

### Yahoo Mail
```javascript
service: 'yahoo'
```

## What Works Without Email Setup

- ✅ AI Chatbot
- ✅ Home page
- ✅ Service browsing
- ✅ Booking history (if already registered)

## What Needs Email Setup

- ❌ Registration (needs verification code)
- ❌ Booking confirmation emails

## Check if It's Working

After setting up:
1. Go to http://localhost:3000/register.html
2. Enter Name, Email, Password
3. Click "Send Verification Code"
4. Check your email inbox
5. Should receive email with 6-digit code
6. Enter code and complete registration

---

**Need help?** Check the server console for error messages - they will show what's wrong.
