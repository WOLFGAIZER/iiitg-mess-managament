const express = require('express');
const router = express.Router();
const { getAllUsers, createUser } = require('../controllers/userController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticateToken, restrictToAdmin, getAllUsers);

// Create a new user (public registration endpoint)
router.post('/register', createUser);

module.exports = router;