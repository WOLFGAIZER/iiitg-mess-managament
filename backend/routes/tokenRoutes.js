const express = require('express');
const router = express.Router();
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');
const { 
  createToken, 
  getTokensByUser, 
  validateToken,
  getAllTokens,
  buyToken,
  countTokensByDate,
  getTotalEarnings
} = require('../controllers/tokenController');

// Get all tokens (admin only)
router.get('/', authenticateToken, restrictToAdmin, getAllTokens);

// Create a new token (admin only)
router.post('/', authenticateToken, restrictToAdmin, createToken);

// Get tokens by user (authenticated users)
router.get('/user/:rollNo', authenticateToken, getTokensByUser);

// Validate a token (authenticated users)
router.get('/validate/:tokenID', authenticateToken, validateToken);

// Buy a token (authenticated users)
router.post("/buy", authenticateToken, buyToken);

// Count tokens purchased on a specific date (admin only)
router.get('/count/:date', authenticateToken, restrictToAdmin, countTokensByDate);

//Get total earnings (FOR ADMINS)
router.get('/total-earnings', authenticateToken, restrictToAdmin, getTotalEarnings); 

module.exports = router;
