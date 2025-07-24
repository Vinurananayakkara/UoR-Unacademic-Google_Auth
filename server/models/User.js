const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  age: Number,
  date:String,
  type:String,
  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  isApproved: {
  type: Boolean,
  default: false,
},

});

module.exports = mongoose.model('User', userSchema);
