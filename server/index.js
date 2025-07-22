const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./passport'); // Google strategy config
const authRoutes = require('./routes/authRoutes');

const app = express();
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL);

app.use('/auth', authRoutes);

app.listen(5000, () => console.log(`Server running on ${process.env.port}`));
