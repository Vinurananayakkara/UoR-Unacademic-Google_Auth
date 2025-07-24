const express = require('express');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser.js');
const isAdmin = require('../middleware/isAdmin.js');

const router = express.Router();

router.get('/users', authenticateUser, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/users/:id',authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ DELETE user
router.delete('/users/:id', authenticateUser, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// ✅ UPDATE user
// PUT /admin/users/:id/approve
router.post('/users/:id/approve', authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;