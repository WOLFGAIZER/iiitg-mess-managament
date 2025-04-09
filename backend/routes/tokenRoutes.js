const express = require('express');
const router = express.Router();
const { 
  createToken, 
  getTokensByUser, 
  validateToken,
  getAllTokens,
  buyToken,
  countTokensByDate,
  getTotalEarnings,
  countTotalTokens
} = require('../controllers/tokenController');

// Get all tokens (Now open to all)
router.get('/', getAllTokens);

// Create a new token (Now open to all)
router.post('/', createToken);

// Get tokens by user (Now open to all)
router.get('/user/:rollno', getTokensByUser);

// Validate a token (Now open to all)
router.get('/validate/:tokenID', validateToken);

// Buy a token (Now open to all)
router.post('/buy', buyToken);

// Count tokens purchased on a specific date (Now open to all)
router.get('/count/:date', countTokensByDate);

// Count total tokens (Now open to all)
router.get('/count-total', countTotalTokens);

// Get total earnings (Now open to all)
router.get('/total-earnings', getTotalEarnings);

module.exports = router;
