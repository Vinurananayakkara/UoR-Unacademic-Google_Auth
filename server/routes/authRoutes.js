const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();


const rateLimit = require('express-rate-limit');


// --- Gmail SMTP transporter setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,         // your Gmail address
    pass: process.env.USER_PASS     // your Gmail App Password (not your normal password)
  }
});

// --- Utility function to send OTP ---
const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"RUCIT-UoR" <${process.env.USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your verification code is ${otp}`,
      html: `<p>Your verification code is <strong>${otp}</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent successfully.");
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};

// --- Google OAuth ---
const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many Google login attempts. Try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', googleAuthLimiter, passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_URL}/login`,
  session: false
}), async (req, res) => {
  const user = req.user;

  // Generate and store OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
  await user.save();

  await sendOTP(user.email, otp);


  res.redirect(`${process.env.CLIENT_URL}/verify?email=${user.email}`);
}

);

// --- Rate limit for OTP resend ---
const resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // max 3 resends in 10 minutes
  message: 'Too many OTP resend attempts. Please wait 10 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Resend OTP ---
router.post('/resend-otp', resendOtpLimiter, async (req, res) => {
  const { email } = req.body;
  console.log('🔁 OTP resend requested for:', email);

  if (!email) {
    console.log('⚠️ Missing email in request body');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('🔍 User lookup result:', user);

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    

    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOTP;
    user.otpExpires = new Date(Date.now() + 10 * 60000);
    await user.save();
    console.log('💾 New OTP saved:', newOTP);

    await sendOTP(email, newOTP);

    return res.json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error('🔥 Resend OTP error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// --- OTP Verification ---
// Limit OTP verification to 10 attempts per 15 minutes per IP
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many OTP verification attempts. Please wait and try again.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/verify-otp', otpVerifyLimiter, async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

 user.verified = true;
await user.save();

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Set token in cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 60 * 60 * 1000,
});

res.json({ message: 'OTP verified', redirectTo: user.isAdmin ? '/admin' : '/profile' });
});
// --- Save Extra Info ---

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

router.post('/add-info', authenticateUser, async (req, res) => {
  try {
    const { name, age ,date,type} = req.body;
    const user = await User.findById(req.user.id); // from token

    if (!user) {
      return res.status(404).json({ message: 'User not found! Please log in' });
    }

    user.name = name;
    user.age = age;
    user.date = date;
    user.type = type;
    await user.save();

    res.json({ message: 'User info updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
