const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0]?.value;
    if (!email) return done(new Error('No email found in Google profile'));

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingUser.googleId = profile.id;
        user = await existingUser.save();
      } else {
        user = await User.create({
          googleId: profile.id,
          email,
          verified: false, // required for OTP logic
        });
      }
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
