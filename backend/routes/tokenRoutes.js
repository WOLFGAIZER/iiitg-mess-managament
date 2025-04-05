const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  createToken, 
  getTokensByUser, 
  validateToken,
  getAllTokens,
  buyToken
} = require('../controllers/tokenController');

// Get all tokens (admin only)
router.get('/', getAllTokens);

// Create a new token (admin only)
router.post('/', createToken);

router.get('/user/:username', authenticateToken, getTokensByUser);
router.get('/validate/:tokenID', authenticateToken, validateToken);
router.post("/buy", buyToken);

module.exports = router;