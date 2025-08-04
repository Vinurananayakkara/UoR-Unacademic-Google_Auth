const express = require('express');
const User = require('../models/User');
const {Post , ClosingDate }= require('../models/Post');
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



// POST /admin/get-posts → Save or Update posts by date
router.post('/get-posts', authenticateUser, isAdmin, async (req, res) => {
  const { addPosts } = req.body;

  if (!addPosts || !Array.isArray(addPosts)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    for (const entry of addPosts) {
      const { createddate, createdposts } = entry;

      if (!createddate || !Array.isArray(createdposts)) continue;

      await Post.findOneAndUpdate(
        { createddate },
        { $set: { createdposts } },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Posts saved successfully' });
  } catch (err) {
    console.error('Error saving posts:', err);
    res.status(500).json({ message: 'Server error while saving posts' });
  }
});

// GET /admin/get-posts → Fetch all saved posts
router.get('/get-posts', async (req, res) => {
  try {
    const allPosts = await Post.find({}).sort({ createddate: 1 });

    // Return in frontend expected format
    const formatted = allPosts.map(({ createddate, createdposts }) => ({
      createddate,
      createdposts,
    }));

    res.status(200).json({ addPosts: formatted });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// DELETE /admin/delete-post/:date → Delete all posts for a given date
router.delete('/delete-post/:date', authenticateUser, isAdmin, async (req, res) => {
  const { date } = req.params;

  try {
    await Post.deleteOne({ createddate: date });
    res.status(200).json({ message: `Posts on ${date} deleted` });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Error deleting post data' });
  }
});

router.post('/closing-date', authenticateUser, isAdmin, async (req, res) => {
  const { closingDate } = req.body;

  try {
    await ClosingDate.deleteMany({});
    await ClosingDate.create({ closingDate });
    res.status(200).json({ message: 'Closing Date saved successfully' });
  } catch (err) {
    console.error('Error saving closing date:', err);
    res.status(500).json({ message: 'Server error while saving closing date' });
  }
});

router.get('/get-closing-date', async (req, res) => {
  try {
    const latest = await ClosingDate.findOne().sort({ _id: -1 });
    if (!latest) return res.status(404).json({ message: 'No closing date found' });
    res.json({ closingDate: latest.closingDate });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching closing date' });
  }
});






module.exports = router;