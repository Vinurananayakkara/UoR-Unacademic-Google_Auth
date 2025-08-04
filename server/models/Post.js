const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  createddate: { type: String, required: true, unique: true },
  createdposts: [{ type: String }],
});

const closingSchema = new mongoose.Schema({
  closingDate: { type: String, required: true },
});

const Post = mongoose.model('Post', postSchema);
const ClosingDate = mongoose.model('ClosingDate', closingSchema);

module.exports = { Post, ClosingDate };
