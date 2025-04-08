const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model
require('dotenv').config();

// JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token
  if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

    try {
      const user = await User.findById(decoded.id); // Fetch user from DB
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      req.user = user; // Attach full user object to request
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });
};

// Admin restriction
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, restrictToAdmin };
