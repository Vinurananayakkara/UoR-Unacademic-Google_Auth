const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  age: Number,
  verified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date
});

module.exports = mongoose.model('User', userSchema);
