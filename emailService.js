const nodemailer = require('nodemailer');

// Configure email service (using Gmail or your SMTP)
// For Gmail: Enable "Less secure app access" or use App Password
let transporter;

const emailUser = process.env.EMAIL_USER || 'luxe.shine.salon@gmail.com';
const emailPass = process.env.EMAIL_PASS || '';

// Create transporter with error handling
if (!emailPass || emailPass === 'your-16-char-app-password') {
  console.warn('⚠️  WARNING: Email password not configured in .env file');
  console.warn('   Using TEST MODE - verification codes will be logged to console\n');
  
  // TEST MODE: Just log codes to console instead of sending emails
  transporter = {
    sendMail: async (options) => {
      if (options.subject.includes('Verification Code')) {
        // Extract code from HTML
        const codeMatch = options.html.match(/<h1[^>]*>(\d+)<\/h1>/);
        const code = codeMatch ? codeMatch[1] : 'unknown';
        console.log(`\n🧪 TEST MODE - Verification Code`);
        console.log(`   To: ${options.to}`);
        console.log(`   CODE: ${code}`);
        console.log(`   (This code expires in 15 minutes)\n`);
      } else if (options.subject.includes('Booking Confirmation')) {
        console.log(`\n🧪 TEST MODE - Booking Confirmation`);
        console.log(`   To: ${options.to}`);
        console.log(`   ${options.subject}\n`);
      }
      return true;
    }
  };
} else {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
}

// Generate verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
async function sendVerificationEmail(email, verificationCode) {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: 'Luxe Shine - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0d6efd;">Welcome to Luxe Shine</h2>
        <p>Thank you for registering! Please use the verification code below to complete your registration:</p>
        <div style="background: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
          <h1 style="color: #0d6efd; letter-spacing: 2px;">${verificationCode}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email prepared for ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Error sending verification email:', err.message);
    return false;
  }
}

// Send booking confirmation email
async function sendBookingConfirmationEmail(email, booking) {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0d6efd;">Booking Confirmed</h2>
        <p>Dear ${booking.name},</p>
        <p>Your booking has been confirmed! Here are your booking details:</p>
        
            <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #0d6efd;">
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Price:</strong> ${typeof booking.price === 'number' ? ('$' + (booking.price/100).toFixed(2)) : booking.price || 'N/A'}</p>
              <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'N/A'}</p>
              <p><strong>Payment Status:</strong> ${booking.paymentStatus || 'N/A'}</p>
              <hr>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
              <p><strong>Address:</strong> ${booking.address}</p>
              <p><strong>City:</strong> ${booking.city}</p>
              <p><strong>ZIP Code:</strong> ${booking.zipcode}</p>
            </div>
        
        <p>Thank you for choosing Luxe Shine! We look forward to serving you.</p>
        <p style="color: #666; font-size: 12px;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email prepared for ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Error sending booking confirmation email:', err.message);
    return false;
  }
}

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendBookingConfirmationEmail
};
