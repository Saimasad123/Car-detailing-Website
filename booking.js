const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { sendBookingConfirmationEmail } = require('../utils/emailService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const bookingsFile = path.join(__dirname, '../data/bookings.json');

// Simple service price list (currency in USD). Update as needed or move to data/services.json
const servicePrices = {
  'Exterior Wash': 3000,        // $30.00
  'Interior Cleaning': 5000,    // $50.00
  'Full Detail': 9000,          // $90.00
  'Full Detailing': 9000        // alias
};

// GET booking history
router.get('/history', (req, res) => {
  console.log('GET /api/bookings/history called with query:', req.query);
  let bookings = [];
  try {
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Error reading bookings' });
  }

  // If email query provided, filter bookings for that user
  const { email } = req.query || {};
  if (email) {
    const searchEmail = String(email).toLowerCase().trim();
    const filtered = bookings.filter(b => {
      const bookingEmail = (b.email || '').toLowerCase().trim();
      return bookingEmail === searchEmail;
    });
    console.log(`Filtering by email: "${searchEmail}"`);
    console.log(`All bookings in DB: ${bookings.map(b => `"${(b.email || '').toLowerCase().trim()}"`).join(', ')}`);
    console.log(`Found ${filtered.length} bookings for email=${email}`);
    return res.json({ bookings: filtered });
  }

  res.json({ bookings });
});

// POST new booking
router.post('/add', async (req, res) => {
  const { name, email, phone, address, city, zipcode, service, date, time, paymentMethod } = req.body;

  // Log incoming data for debugging
  console.log('Booking data received:', { name, email, phone, address, city, zipcode, service, date, time });

  // More lenient validation - allow empty strings to be treated as missing
  const missingFields = [];
  if (!name || name.trim() === '') missingFields.push('name');
  if (!email || email.trim() === '') missingFields.push('email');
  if (!phone || phone.trim() === '') missingFields.push('phone');
  if (!address || address.trim() === '') missingFields.push('address');
  if (!city || city.trim() === '') missingFields.push('city');
  if (!zipcode || zipcode.trim() === '') missingFields.push('zipcode');
  if (!service || service.trim() === '') missingFields.push('service');
  if (!date || date.trim() === '') missingFields.push('date');
  if (!time || time.trim() === '') missingFields.push('time');

  if (missingFields.length > 0) {
    console.error('Missing fields:', missingFields);
    return res.status(400).json({ 
      msg: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields: missingFields
    });
  }

  let bookings = [];
  try {
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Error reading bookings' });
  }

  const price = servicePrices[service] || 0;

  const newBooking = { 
    name: name.trim(), 
    email: email.trim(), 
    phone: phone.trim(), 
    address: address.trim(), 
    city: city.trim(), 
    zipcode: zipcode.trim(), 
    service: service.trim(), 
    date, 
    time,
    bookingId: 'BK' + Date.now(),
    bookedAt: new Date().toISOString(),
    price, // in cents-like units (see servicePrices)
    paymentMethod: paymentMethod || 'cash',
    paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending'
  };
  bookings.push(newBooking);

  try {
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
    console.log('Booking saved successfully:', newBooking.bookingId);
  } catch (err) {
    return res.status(500).json({ msg: 'Error saving booking' });
  }

  // Send confirmation email asynchronously (don't wait for it)
  sendBookingConfirmationEmail(email, newBooking).catch(err => {
    console.error('Failed to send confirmation email:', err);
  });

  res.status(201).json({ msg: 'Booking added', booking: newBooking });
});

// Create a Stripe Checkout session and return URL
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { name, email, phone, address, city, zipcode, service, date, time } = req.body;
    const price = servicePrices[service] || 0;

    if (!stripe) return res.status(500).json({ msg: 'Stripe not configured' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: service },
          unit_amount: price // already in cents-like units above
        },
        quantity: 1
      }],
      metadata: { name, email, phone, address, city, zipcode, service, date, time },
      success_url: (process.env.STRIPE_SUCCESS_URL || 'http://localhost:5000/booking_payment_success.html') + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:5000/booking.html'
    });

    // Save a pending booking linked to this session
    let bookings = [];
    try {
      if (fs.existsSync(bookingsFile)) bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    } catch (err) { /* ignore */ }

    const pending = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      zipcode: zipcode.trim(),
      service: service.trim(),
      date, time,
      bookingId: 'BK' + Date.now(),
      bookedAt: new Date().toISOString(),
      price,
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripeSessionId: session.id
    };
    bookings.push(pending);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ msg: 'Failed to create checkout session' });
  }
});

// Complete payment: client will call this after Stripe redirects to success URL with session_id
router.post('/payments/complete', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ msg: 'Missing sessionId' });
    if (!stripe) return res.status(500).json({ msg: 'Stripe not configured' });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) return res.status(404).json({ msg: 'Session not found' });

    if (session.payment_status !== 'paid') return res.status(400).json({ msg: 'Payment not completed' });

    // Pull booking data from metadata
    const md = session.metadata || {};

    // Load bookings and update matching pending booking, or create new one
    let bookings = [];
    try { if (fs.existsSync(bookingsFile)) bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8')); } catch (err) {}

    let booking = bookings.find(b => b.stripeSessionId === sessionId);
    if (booking) {
      booking.paymentStatus = 'paid';
    } else {
      const price = servicePrices[md.service] || 0;
      booking = {
        name: md.name,
        email: md.email,
        phone: md.phone,
        address: md.address,
        city: md.city,
        zipcode: md.zipcode,
        service: md.service,
        date: md.date,
        time: md.time,
        bookingId: 'BK' + Date.now(),
        bookedAt: new Date().toISOString(),
        price,
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        stripeSessionId: sessionId
      };
      bookings.push(booking);
    }

    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    // Send final confirmation email
    sendBookingConfirmationEmail(booking.email, booking).catch(err => console.error('Email send failed:', err));

    res.json({ msg: 'Payment verified and booking confirmed', booking });
  } catch (err) {
    console.error('Error completing payment:', err);
    res.status(500).json({ msg: 'Error completing payment' });
  }
});

module.exports = router;
