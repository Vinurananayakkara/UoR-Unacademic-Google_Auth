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

// Promote user to final
router.post('/users/:id/finalize', authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isFinal: true, isApproved: false }, // promote to final and remove approved
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User finalized', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to finalize user' });
  }
});

// ✅ Soft Delete
// ✅ Soft delete route changed to POST for clarity
router.post('/users/:id/soft-delete', authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isApproved: false, isFinal: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User marked as deleted', user });
  } catch (err) {
    console.error('Error soft deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/users/:id/restore', authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    res.json({ message: 'User restored', user });
  } catch (err) {
    res.status(500).json({ message: 'Restore failed' });
  }
});

router.delete('/users/:id/permanent', authenticateUser, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Permanent deletion failed' });
  }
});

// Toggle Admin status
router.put('/users/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = req.body.isAdmin;
    await user.save();

    res.json({ message: 'Admin status updated', user });
  } catch (err) {
    console.error('Error updating admin status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;