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
//app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
//app.use(passport.session());

app.get('/test-session', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

mongoose.connect(process.env.MONGODB_URL);

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);


app.listen(5000, () => console.log(`Server running on ${process.env.port}`));
