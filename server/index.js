const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./passport'); // Google strategy config
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(session({ secret: 'secret', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true only in HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
 }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/test-session', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URL);

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);


app.listen(5000, () => console.log(`Server running on ${process.env.port}`));
