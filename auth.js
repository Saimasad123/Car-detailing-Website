const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { generateVerificationCode, sendVerificationEmail } = require('../utils/emailService');

const usersFile = path.join(__dirname, '../data/users.json');
const verificationFile = path.join(__dirname, '../data/verifications.json');

// Helper: Get verifications data
function getVerifications() {
  try {
    if (fs.existsSync(verificationFile)) {
      return JSON.parse(fs.readFileSync(verificationFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading verifications:', err);
  }
  return [];
}

// Helper: Save verifications data
function saveVerifications(verifications) {
  try {
    fs.writeFileSync(verificationFile, JSON.stringify(verifications, null, 2));
  } catch (err) {
    console.error('Error saving verifications:', err);
  }
}

/* ----------- REGISTER STEP 1: Send Verification Code ----------- */
router.post('/register-send-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email required' });
  }

  // Normalize email for consistency
  const normalizedEmail = String(email).toLowerCase().trim();

  let users = [];
  try {
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Error reading users file' });
  }

  // Check if user already exists (case-insensitive)
  const userExists = users.find(u => (u.email || '').toLowerCase().trim() === normalizedEmail);
  if (userExists) {
    return res.status(409).json({ msg: 'User already exists' });
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Store verification code
  let verifications = getVerifications();
  verifications = verifications.filter(v => (v.email || '').toLowerCase().trim() !== normalizedEmail); // Remove old codes
  verifications.push({ email: normalizedEmail, code: verificationCode, expiresAt });
  saveVerifications(verifications);

  // Send email
  const emailSent = await sendVerificationEmail(normalizedEmail, verificationCode);

  if (emailSent) {
    res.status(200).json({ msg: 'Verification code sent to email', email: normalizedEmail });
  } else {
    res.status(500).json({ msg: 'Error sending verification code' });
  }
});

/* ----------- REGISTER STEP 2: Verify Code & Create User ----------- */
router.post('/register', (req, res) => {
  const { name, email, password, verificationCode } = req.body;

  if (!name || !email || !password || !verificationCode) {
    return res.status(400).json({ msg: 'All fields required' });
  }

  // Normalize email for consistency
  const normalizedEmail = String(email).toLowerCase().trim();

  // Verify code
  let verifications = getVerifications();
  const verification = verifications.find(v => 
    (v.email || '').toLowerCase().trim() === normalizedEmail && 
    v.code === verificationCode
  );

  if (!verification) {
    return res.status(400).json({ msg: 'Invalid verification code' });
  }

  if (verification.expiresAt < Date.now()) {
    return res.status(400).json({ msg: 'Verification code expired' });
  }

  let users = [];
  try {
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Error reading users file' });
  }

  // Check if user exists (case-insensitive)
  const userExists = users.find(u => (u.email || '').toLowerCase().trim() === normalizedEmail);
  if (userExists) {
    return res.status(409).json({ msg: 'User already exists' });
  }

  // Create user (store with normalized email)
  const newUser = { name, email: normalizedEmail, password, registeredAt: new Date().toISOString() };
  users.push(newUser);

  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    return res.status(500).json({ msg: 'Error saving user' });
  }

  // Remove used verification code
  verifications = verifications.filter(v => !(
    (v.email || '').toLowerCase().trim() === normalizedEmail && 
    v.code === verificationCode
  ));
  saveVerifications(verifications);

  res.status(201).json({ msg: 'Registration successful', user: newUser });
});

/* ---------------- LOGIN ---------------- */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password required' });
  }

  let users = [];

  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }

  // Use case-insensitive email matching (like registration does)
  const searchEmail = String(email).toLowerCase().trim();
  const user = users.find(u => 
    (u.email || '').toLowerCase().trim() === searchEmail && 
    u.password === password
  );

  if (!user) {
    return res.status(401).json({ msg: 'Invalid email or password' });
  }

  res.status(200).json({ msg: 'Login successful', user });
});

module.exports = router;
