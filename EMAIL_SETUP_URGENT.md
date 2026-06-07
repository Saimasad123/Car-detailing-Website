# ⚠️ URGENT: Gmail Credentials Required for Email Features

## The Problem

Error: `Username and Password not accepted`

This means the `.env` file has placeholder values instead of real Gmail credentials.

## The Solution (5 Minutes)

### Option 1: Use Existing Gmail Account

If you have a Gmail account (like `yourname@gmail.com`):

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification"
   - Click and follow prompts

2. **Get App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - **App**: Select "Mail"
   - **Device**: Select "Windows/Mac/Linux"
   - Click "Generate"
   - Copy the **16-character password** (shown in yellow box)
   - It looks like: `xxxx xxxx xxxx xxxx`

3. **Update `.env` File**
   Open `/home/kali-attacker/Downloads/project/backend/.env`
   
   Find these lines:
   ```
   EMAIL_USER=luxe.shine.salon@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```
   
   Replace with your real credentials:
   ```
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

4. **Restart Server**
   ```bash
   cd /home/kali-attacker/Downloads/project/backend
   npm start
   ```

5. **Test Registration**
   - Open: http://localhost:3000/register.html
   - Try registering
   - Should receive email with code

### Option 2: Use the Placeholder Gmail (If You Have Access)

If you have access to `luxe.shine.salon@gmail.com`:

1. Log into that account
2. Follow steps 1-2 from Option 1 (get the app password)
3. Update `.env` with the app password
4. Restart server

### Option 3: Skip Email (For Development Only)

To test WITHOUT emails:

1. Update registration form to NOT require verification
2. Edit `backend/routes/auth.js`:
   - Skip the verification code check
   - Create user directly

**Not recommended** - email features are important for production.

## Where to Get Gmail App Password

**DON'T MISS THESE STEPS:**
- ✅ 2-Factor Authentication **MUST be enabled** first
- ✅ App password is **16 characters** (not your Gmail password)
- ✅ It looks like: `xxxx xxxx xxxx xxxx` (with spaces)
- ✅ Copy it **exactly** as shown (with or without spaces is fine)

## Common Mistakes

❌ Using regular Gmail password instead of App Password
- Gmail password: `MyPassword123!`
- App Password: `abcd efgh ijkl mnop` ← Use this!

❌ Not enabling 2-Factor Authentication first
- 2-Factor is required for App Passwords

❌ Typos in EMAIL_USER or EMAIL_PASS
- Double-check the values in `.env`

❌ Not restarting server after updating `.env`
- Changes don't take effect until server restarts

## Verify It's Working

After updating `.env` and restarting:

1. Check server console - should NOT show "Username and Password not accepted"
2. Try registering with an email
3. Check your email inbox for verification code
4. If you see the code email - ✅ It's working!

## If Still Not Working

Check the server console output. Common errors:

**"Email service not configured"**
- EMAIL_PASS is still the placeholder value
- Update `.env` with real app password

**"Invalid login: 535-5.7.8 Username and Password not accepted"**
- Wrong app password
- 2-Factor authentication not enabled
- Check you're copying the complete 16-character password

**"EAUTH error"**
- Credentials are incorrect
- Check EMAIL_USER matches the account that created the app password

## Files to Edit

📄 `/home/kali-attacker/Downloads/project/backend/.env`

Change:
```env
EMAIL_USER=luxe.shine.salon@gmail.com
EMAIL_PASS=your-16-char-app-password
```

To your real Gmail credentials.

## Next Steps

1. Get Gmail App Password (5 minutes)
2. Update `.env` file
3. Restart server: `npm start`
4. Test registration
5. Enjoy email features!

---

**Questions?** Check the server console - error messages will guide you!
