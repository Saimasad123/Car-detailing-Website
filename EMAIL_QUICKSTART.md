# Quick Start - Email Features

## What's New?

✅ **Email Verification** - Users verify their email during registration with a 6-digit code
✅ **Booking Confirmations** - Users get booking details emailed automatically

## Fast Setup (3 Steps)

### Step 1: Get Gmail App Password
Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows/Mac/Linux"
- Copy the 16-character password

### Step 2: Update .env
Open `backend/.env` and update:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

### Step 3: Restart Server
```bash
cd backend
npm start
```

## Test It

**Registration Flow:**
1. Go to http://localhost:3000/register.html
2. Enter Name, Email, Password
3. Click "Send Verification Code"
4. Check your email for 6-digit code
5. Enter code and click "Verify & Register"

**Booking Emails:**
1. Log in and create a booking
2. On success, you'll see the Booking ID
3. Check your email for booking confirmation

## Need Help?

See `EMAIL_SETUP.md` for detailed Gmail setup instructions and troubleshooting.

## Files Changed

**Backend:**
- ✅ `backend/routes/auth.js` - 2-step verification
- ✅ `backend/routes/booking.js` - Send confirmation emails
- ✅ `backend/utils/emailService.js` - Email sending service
- ✅ `backend/.env` - Email configuration

**Frontend:**
- ✅ `register.html` - 2-step registration form
- ✅ `js/auth.js` - Registration flow logic
- ✅ `js/booking.js` - Show email sent message

**Data:**
- ✅ `backend/data/verifications.json` - Store verification codes

## Key Features

- 🔒 Email verification before account creation
- ⏱️ Codes expire in 15 minutes
- 📧 Automatic booking confirmation emails
- 🔐 Uses Gmail App Passwords (secure)
- ⚡ Asynchronous email sending (doesn't slow down server)
