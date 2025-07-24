const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => 
  User.findById(id).then(user => done(null, user))
);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0]?.value;
    if (!email) return done(new Error('No email found in Google profile'));

    // Check if user exists by Google ID
    let user = await User.findOne({ googleId: profile.id });

    // Determine if this email should have admin privileges
    const isAdmin = email.toLowerCase() === (process.env.ADMIN_URL || '').toLowerCase();

    if (!user) {
      // User not found by Google ID, check if existing user by email
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // Link Google ID and update admin role if needed
        existingUser.googleId = profile.id;
        if (isAdmin) existingUser.isAdmin = true;
        user = await existingUser.save();
        
      } else {
        // Create new user with admin flag if email matches
        

        user = await User.create({
          googleId: profile.id,
          email,
          verified:false,
          isAdmin, // Assign admin role here
        });
      }
    }
    console.log('Expected admin email:', process.env.ADMIN_URL);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
