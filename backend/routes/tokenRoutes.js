const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  createToken, 
  getTokensByUser, 
  validateToken,
  getAllTokens 
} = require('../controllers/tokenController');

// Get all tokens (admin only)
router.get('/', authenticateToken, getAllTokens);

// Create a new token (admin only)
router.post('/', authenticateToken, createToken);

router.get('/user/:username', authenticateToken, getTokensByUser);
router.get('/validate/:tokenID', authenticateToken, validateToken);

module.exports = router;