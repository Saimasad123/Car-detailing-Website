# TEMPORARY: Test Registration Without Real Gmail

If you want to test the registration system **without setting up real Gmail**, here's a workaround:

## Temporary Email Service (For Testing Only)

Replace `backend/utils/emailService.js` with this test version:

```javascript
// TEMPORARY TEST VERSION - Do not use in production

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store codes in memory (temporary)
const testCodes = {};

async function sendVerificationEmail(email, verificationCode) {
  // Just store the code in memory for testing
  testCodes[email] = {
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000
  };
  
  console.log(`✅ TEST MODE: Verification code for ${email}: ${verificationCode}`);
  console.log(`   (Expires in 15 minutes, stored in memory)`);
  return true;
}

async function sendBookingConfirmationEmail(email, booking) {
  console.log(`✅ TEST MODE: Booking confirmation sent to ${email}`);
  console.log(`   Booking ID: ${booking.bookingId}`);
  console.log(`   Service: ${booking.service}`);
  return true;
}

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendBookingConfirmationEmail
};
```

## How It Works

1. Replace `backend/utils/emailService.js` with the above code
2. Restart server: `npm start`
3. Try registering
4. The server console will **display the verification code**
5. Copy the code from console and enter it in the form

## Example Server Output

```
✅ TEST MODE: Verification code for user@example.com: 123456
   (Expires in 15 minutes, stored in memory)
```

## Then Copy the Code

1. See the code in server console: `123456`
2. Go to registration form Step 2
3. Enter `123456` in the verification field
4. Click "Verify & Register"
5. ✅ Registration complete!

## Booking Emails

Same thing - see confirmation in server console:

```
✅ TEST MODE: Booking confirmation sent to user@example.com
   Booking ID: BK1706161123456
   Service: Hair Styling
```

## When You're Ready for Real Emails

1. Get Gmail App Password (see GMAIL_SETUP_URGENT.md)
2. Update `.env` with real credentials
3. Restore original `backend/utils/emailService.js` (or reinstall)
4. Restart server

## ⚠️ Important Notes

- **This is only for testing/development**
- **Do NOT use in production**
- **Codes are only stored in memory (lost on server restart)**
- **No actual emails are sent**

## Reinstall Original Email Service

To get back to real emails:

```bash
cd backend
npm install
```

This will restore the original emailService.js from the package.

---

Use this for quick testing, but set up real Gmail for actual use!
