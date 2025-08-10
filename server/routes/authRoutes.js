const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();


const rateLimit = require('express-rate-limit');

const multer = require('multer');
const path = require('path');

// Set up Multer storage
const fs = require('fs');
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      let user;

      if (req.session?.returningUserId) {
        user = await User.findById(req.session.returningUserId);
      } else {
        user = await User.findById(req.user.id);
      }

      if (!user || !user.nic || !user.selectedPost) {
        return cb(new Error('Missing NIC or selected post information'));
      }

      const uploadPath = path.join(__dirname, '../uploads', user.nic, user.selectedPost);
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });




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
  let user = await User.findOne({ email: req.user.email });

if (!user) {
  user = new User({
    googleId: req.user.id,
    email: req.user.email,
    verified: false
  });
}

  // Generate and store OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await User.findOneAndUpdate(
  { email: user.email },
  { otp, otpExpires: new Date(Date.now() + 10 * 60000) },
  { upsert: true, new: true }
);
  
  await sendOTP(user.email, otp);
  console.log("otp is :", otp);


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
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.findOneAndUpdate(
      { email },
      {
        otp: newOTP,
        otpExpires: new Date(Date.now() + 10 * 60000)
      },
      { new: true } // return updated user
    );

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    await sendOTP(email, newOTP);
    console.log('✅ OTP resent successfully to:', email);
    console.log('✅ New OTP:', newOTP);

    res.json({ message: 'OTP resent successfully' });
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
  user.otp = null;
  user.otpExpires = null;
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

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 1000,
  });

  // ✅ Redirect logic
if (user.isAdmin) {
  return res.json({ message: 'OTP verified', redirectTo: '/admin' });
}
  // ✅ Add custom redirect logic for isSubmitted = false
  if (!user.isSubmitted) {
    return res.json({
      message: 'Need clarification',
      askAction: true, // frontend can use this flag
      options: ['Apply for a new post', 'Continue existing application'],
    });
  }

  // ✅ For already submitted users, allow multi-application
  let redirectTo = user.infoSuccess
    ? '/upload-file'
    : '/profile';

  return res.json({ message: 'OTP verified', redirectTo });
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

const sendUploadInstructions = async (email) => {
  try {
    const mailOptions = {
      from: `"RUCIT-UoR" <${process.env.USER}>`,
      to: email,
      subject: 'Next Step: Upload Your Documents',
      text: `Your information has been successfully saved.

Please continue your application by uploading a SINGLE .zip file containing:
- Passport size photograph
- Copy of NIC
- Other essential documents

Login to your account and proceed with the upload.`,
      html: `
        <p>Your information has been successfully saved.</p>
        <p><strong>Please continue your application by uploading a SINGLE .zip file</strong> containing:</p>
        <ul>
          <li>Passport size photograph</li>
          <li>Copy of NIC</li>
          <li>Other essential documents</li>
        </ul>
        <p>Login to your account and proceed with the upload.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Upload instructions sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending upload instructions:", error);
  }
};


router.post('/add-info', authenticateUser, async (req, res) => {
  try {
    const {email,
      date, type, post, selectedPost,
      fullName, nameWithInitials, age, gender, dob, nic, height, chest,
      civilStatus, permanentAddress, telephoneLand, telephoneMobile,
      citizenship, ethnicGroup,
      province, district, divisional_secretariat, grama_niladhari_division, police_division,
      driving_no ,driving_issue_date
    } = req.body;
 
     const userEmail = email || req.user.email;

    // First check if a record exists with same email, nic, and selectedPost
   const existingUser = await User.findOneAndUpdate(
  {
    email: userEmail,
    nic,
    selectedPost
  },
  {
    $set: {
      email,nic,date, type, post, selectedPost,
      fullName, nameWithInitials, age, gender, dob, height, chest,
      civilStatus, permanentAddress, telephoneLand, telephoneMobile,
      citizenship, ethnicGroup,
      province, district, divisional_secretariat, grama_niladhari_division, police_division,
      driving_no, driving_issue_date,infoSuccess:true
    }
  },
  { new: true }

);


if (existingUser) {
  await sendUploadInstructions(userEmail); // Send upload instructions
  return res.json({
    success: true,
    message: 'User information updated successfully',
    user: existingUser,
    infoSuccess:true,
  });
}

    // If no existing record, create new one
    const newUser = new User({
      email: userEmail,
      date, type, post, selectedPost,
      fullName, nameWithInitials, age, gender, dob, nic, height, chest,
      civilStatus, permanentAddress, telephoneLand, telephoneMobile,
      citizenship, ethnicGroup,
      province, district, divisional_secretariat, grama_niladhari_division, police_division,
      driving_no, driving_issue_date,infoSuccess:true
    });

    await newUser.save();

    // ✅ Send upload instructions email
    await sendUploadInstructions(userEmail);

    res.json({ success: true, message: 'User information saved successfully', user: newUser,infoSuccess:true });
    console.log(newUser.nic);

  } catch (err) {
    console.error('Error in /add-info:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/list-files/:nic/:selectedPost', authenticateUser, async (req, res) => {
  try {
    const { nic, selectedPost } = req.params;

    const user = await User.findOne({
      nic,
      selectedPost,
      email: req.user.email // ensures only their own files are listed
    });

    if (!user || !user.fileName) {
      return res.json({ files: [] });
    }

    res.json({
      files: [{
        name: user.fileName,
        path: user.filePath
      }]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching file list' });
  }
});

// --- File Upload Confirmation Email ---
const sendFileUploadConfirmation = async (email) => {
  try {
    const mailOptions = {
      from: `"RUCIT-UoR" <${process.env.USER}>`,
      to: email,
      subject: 'File Upload Successful',
      text: `Your file has been successfully saved under the email: ${email}`,
      html: `<p>Your file has been successfully saved under the email: <strong>${email}</strong>.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 File upload confirmation sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending file upload confirmation email:", error);
  }
};


// File submission route (protected)
router.post('/submit-file', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Optionally, save file info to user or DB here
    const targetUserId = req.session?.returningUserId || req.user.id;
    const user = await User.findById(targetUserId);

    if (user) {
      user.isSubmitted = true;
       // Save relative path so we can serve it easily later
      const relativePath = path.relative(
        path.join(__dirname, '../uploads'),
        req.file.path
        );

        user.filePath = relativePath;
        user.fileName = req.file.filename;

        await user.save();

        // ✅ Send confirmation email
        await sendFileUploadConfirmation(user.email);

        }

        res.redirect('/');

      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        filePath: user.filePath
      });
    
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'File upload failed' });
  }
});


router.post('/handle-returning-user', authenticateUser, async (req, res) => {
  const { action, Nic, choosePost, previousDate } = req.body;
  
  const normalize = (str) => (typeof str === 'string' ? str.trim().toLowerCase() : '');

    if (action === 'new') {
    // Just redirect for new action, no user lookup needed
    return res.json({
      message: 'Start a new application',
      redirectTo: '/profile'
    });
  }

if (action === 'continue') {


  // Pick user with infoSuccess true or fallback to first one
  const user = await User.findOne({
      email: req.user.email,
  nic: { $ne: null, $ne: '' },
  selectedPost: { $ne: null, $ne: '' },
     nic: { $regex: new RegExp(`^${normalize(Nic)}$`, 'i') },
      selectedPost: choosePost,
      date: previousDate
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Save this user for later uploads
  req.session.returningUserId = user._id; // store in session

  return res.json({
      message: 'Continue your existing application',
      redirectTo: '/profile/file-upload'
    });
  }

  return res.status(400).json({ message: 'Invalid action' });
});








module.exports = router;
