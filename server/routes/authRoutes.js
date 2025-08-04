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
      html: `<p>Your OTP is <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p><p>If you didn’t request this, ignore it.</p>`

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
     const {
      date, type, post,selectedPost,
      fullName, nameWithInitials, age, gender, dob, nic, height, chest,
      civilStatus, permanentAddress, telephoneLand, telephoneMobile,
      citizenship, ethnicGroup,
      province, district, divisional_secretariat, grama_niladhari_division, police_division,
      driving_no, driving_no_issuing_date,

      // O/L & A/L
      ol, ol_index_1, ol_index_2, ol_index_3, ol_year_1, ol_year_2, ol_year_3,
      al, al_index_1, al_index_2, al_index_3, al_year_1, al_year_2, al_year_3,

      // Education & Qualifications
      schools_Attended, university, other_education, professional, sports, other,

      // Work Experience
      presentOccupation, presentOccupation_date, postGrades, pastOccupation

    } = req.body;

    let user = await User.findOne({
  email: req.user.email,
  post: { $in: post } , // Check if any matching post exists
});

if (!user && !req.user.isAdmin) {
  // Create a new user record (even if email is the same)
  user = new User({
    email: req.user.email,
    selectedPost: req.user.selectedPost// This can be an array
  });
}


   // Set core info
    user.date = date;
    user.type = type;
    user.fullName = fullName;
    user.nameWithInitials = nameWithInitials;
    user.age = age;
    user.gender = gender;
    user.dob = dob;
    user.nic = nic;
    user.height = height;
    user.chest = chest;
    user.civilStatus = civilStatus;
    user.permanentAddress = permanentAddress;
    user.telephoneLand = telephoneLand;
    user.telephoneMobile = telephoneMobile;
    user.citizenship = citizenship;
    user.ethnicGroup = ethnicGroup;
    user.selectedPost = selectedPost;

    // Location
    user.province = province;
    user.district = district;
    user.divisional_secretariat = divisional_secretariat;
    user.grama_niladhari_division = grama_niladhari_division;
    user.police_division = police_division;

    // Driving
    user.driving_no = driving_no;
    user.driving_no_issuing_date = driving_no_issuing_date;

    // OL and AL
    user.ol = ol;
    user.ol_index_1 = ol_index_1;
    user.ol_index_2 = ol_index_2;
    user.ol_index_3 = ol_index_3;
    user.ol_year_1 = ol_year_1;
    user.ol_year_2 = ol_year_2;
    user.ol_year_3 = ol_year_3;

    user.al = al;
    user.al_index_1 = al_index_1;
    user.al_index_2 = al_index_2;
    user.al_index_3 = al_index_3;
    user.al_year_1 = al_year_1;
    user.al_year_2 = al_year_2;
    user.al_year_3 = al_year_3;

    // Education and Qualifications
    // Education and Qualifications

    user.al = typeof al === 'object' && !Array.isArray(al)
  ? al
  : { firstAttempt: [], secondAttempt: [], thirdAttempt: [] };

  user.ol = typeof ol === 'object' && !Array.isArray(ol)
  ? ol
  : { firstAttempt: [], secondAttempt: [], thirdAttempt: [] };


user.schools_Attended = Array.isArray(schools_Attended)
  ? schools_Attended.filter(item => item.name_of_school)
  : [];


user.university = Array.isArray(university)
  ? university.filter(item => item.institute && item.type && item.year && item.class && item.date)
  : [];

user.other_education = Array.isArray(other_education)
  ? other_education.filter(item => item.institute && item.course)
  : [];

user.professional = Array.isArray(professional)
  ? professional.filter(item => item.institute && item.course)
  : [];

user.sports = Array.isArray(sports)
  ? sports.filter(item => item.activity)
  : [];

user.other = Array.isArray(other)
  ? other.filter(item => item.qualification)
  : [];

// Work Experience
user.presentOccupation = Array.isArray(presentOccupation)
  ? presentOccupation.filter(item => item.post || item.place)
  : [];

user.postGrades = Array.isArray(postGrades)
  ? postGrades.filter(item => item.grade)
  : [];

user.pastOccupation = Array.isArray(pastOccupation)
  ? pastOccupation.filter(item => item.place || item.designation)
  : [];


    // Work
    
    user.presentOccupation_date = presentOccupation_date;
   

    await user.save();


    res.json({ message: 'User info updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
