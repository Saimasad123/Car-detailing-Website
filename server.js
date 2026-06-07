const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();   // 🔐 Load .env (OpenAI key, etc)

// ==================
// Routes
// ==================
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/booking');
const chatRoutes = require('./routes/chat');   // 🤖 AI chatbot route
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 5000;

// ==================
// Middlewares
// ==================
app.use(cors());
app.use(bodyParser.json());

// ==================
// API Routes
// ==================
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/chat', chatRoutes);   // 🤖 chatbot endpoint
app.use('/api/admin', adminRoutes);

// ==================
// Serve Frontend Files
// ==================
app.use(express.static(path.join(__dirname, '..')));

// ==================
// Health/Test Route
// ==================
app.get('/', (req, res) => {
  res.send('Luxe Shine Backend API is running 🚀');
});

// ==================
// Start Server
// ==================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
