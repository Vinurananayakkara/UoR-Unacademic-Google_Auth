
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
    console.log("🔑 JWT Auth Middleware Hit");
    console.log("Cookies:", req.cookies);

  if (!token) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);


    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      verified: user.verified
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
