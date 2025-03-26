const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // Will be hashed
  USERID: { type: String, required: true, unique: true }, // Unique user identifier (e.g., roll number)
  course: { 
    type: String, 
    required: true, 
    enum: ['B.Tech', 'M.Tech', 'PhD'], 
    default: 'B.Tech' 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);