const isAdmin = (req, res, next) => {
  console.log("isAdmin Middleware Hit. User:", req.user);

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admins only' });
  }

  next();
};

module.exports = isAdmin; // ✅ Export AFTER the function is fully defined
