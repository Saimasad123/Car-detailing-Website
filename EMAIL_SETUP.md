# Email Configuration Guide - Luxe Shine

## Features Added
✅ **Email Verification on Registration** - Users must verify their email with a code before registration is complete
✅ **Booking Confirmation Emails** - Users receive booking details and booking ID to their email

## Gmail Setup Instructions

### Step 1: Create Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Look for **"App passwords"** (if you don't see it, enable 2-factor authentication first)
3. Select:
   - **App**: Mail
   - **Device**: Windows/Mac/Linux
4. Google will generate a **16-character password**
5. Copy this password

### Step 2: Update .env File

Open `backend/.env` and replace:

```env
EMAIL_USER=luxe.shine.salon@gmail.com
EMAIL_PASS=your-16-char-app-password
```

With your actual Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**Important**: Use the 16-character **App Password**, NOT your regular Gmail password.

### Step 3: Test Email Setup

After restarting the server, try registering a new account. You should receive a verification code at your email.

## Using Other Email Services

The email service supports any SMTP-compatible service. To use a different provider, modify `backend/utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

Common services:
- **Gmail**: `service: 'gmail'`
- **Outlook**: `service: 'outlook'`
- **Yahoo**: `service: 'yahoo'`
- **Custom SMTP**: Specify `host`, `port`, and `secure` values

## Registration Flow

1. User enters Name, Email, Password on register.html
2. Click "Send Verification Code"
3. Server generates 6-digit code and sends to email
4. Code expires in 15 minutes
5. User enters code on second form
6. On successful verification, user account is created
7. Redirect to login page

## Booking Confirmation Flow

1. User completes booking form
2. Booking is saved to database
3. Automatically sends email with:
   - Booking ID (e.g., BK1769808171458)
   - Service details
   - Date and time
   - Full address information
   - Contact confirmation

## Troubleshooting

### Emails not sending?
- ✅ Check `.env` file has `EMAIL_USER` and `EMAIL_PASS`
- ✅ Restart backend server: `npm start`
- ✅ Check Gmail App Password (not regular password)
- ✅ Enable 2-factor authentication on Gmail account
- ✅ Check server console for error messages

### Code expired error?
- Verification codes are valid for 15 minutes
- Resend code by clicking "Send Verification Code" again

### Not receiving emails?
- Check spam/promotions folder
- Verify email address is correct
- Check firewall/network restrictions
- Ensure `nodemailer` is installed: `npm install nodemailer`

## Environment File Setup

Make sure `backend/.env` exists with these variables:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# AI Service (if using)
USE_AI_SERVICE=local
```

## Security Notes

- ✅ Verification codes are stored with expiration time
- ✅ Codes are deleted after successful verification
- ✅ App Passwords are more secure than storing regular passwords
- ✅ Emails contain no sensitive password information
