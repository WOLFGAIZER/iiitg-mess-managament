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
  countTotalTokens,
  countTokensByUser,  // ✅ Add this missing function
  useToken
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

// Get total tokens bought by a specific user (by roll number)
router.get('/count-user/:rollno', countTokensByUser); // ✅ Route now works

//count the no. of tokens used and deduce them
router.post("/use", useToken);

module.exports = router;
