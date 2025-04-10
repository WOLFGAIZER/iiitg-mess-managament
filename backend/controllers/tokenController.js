const { body, validationResult } = require('express-validator');
const Token = require('../models/Token');
const { v4: uuidv4 } = require('uuid');

// Validation rules for token creation (includes numberOfTokens)
const tokenCreationValidationRules = [
  body('rollno').notEmpty().withMessage('Roll number is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount required'),
  body('numberOfTokens').isInt({ min: 1 }).withMessage('At least 1 token required'),
];

// Validation rules for buying tokens (excludes numberOfTokens)
const buyTokenValidationRules = [
  body('rollno').notEmpty().withMessage('Roll number is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount required'),
];

//count total tokens
const countTotalTokens = async (req, res) => {
  try {
    const totalTokens = await Token.countDocuments();
    
    res.status(200).json({
      success: true,
      message: `Total number of tokens: ${totalTokens}`,
      totalTokens
    });
  } catch (error) {
    console.error('[ERROR] Counting Total Tokens:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

//buy token
const buyToken = [
  ...buyTokenValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollno, totalAmount } = req.body;

      // Find the existing token for the user
      let token = await Token.findOne({ rollno });

      if (!token) {
        token = new Token({
          tokenID: uuidv4(),
          rollno,
          price: totalAmount / 130,  // ✅ Ensure `price` is set
          balance: 0,  // Initialize balance
          isActive: true
        });
      }

      // Increment balance (₹10 = 1 token)
      const tokenValue = Math.floor(totalAmount / 10); 
      token.balance += tokenValue;

      // Save the updated token
      await token.save();

      res.status(200).json({
        success: true,
        message: "Token balance updated successfully",
        token: {
          tokenID: token.tokenID,
          rollno: token.rollno,
          price: token.price,  // ✅ Ensure price is returned
          balance: token.balance
        }
      });
    } catch (error) {
      console.error("[ERROR] Buying Token:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },
];


// Create a new token
const createToken = [
  ...tokenCreationValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollno, totalAmount, numberOfTokens } = req.body;

      const newToken = new Token({
        tokenID: uuidv4(),
        rollno,
        price: totalAmount / numberOfTokens, // Price per token
        balance: totalAmount, // Initial balance based on total amount
        isActive: true,
        date: new Date(),
      });

      await newToken.save();
      res.status(201).json({ success: true, message: 'Token created', data: newToken });
    } catch (error) {
      console.error('[ERROR] Creating Token:', error);
      res.status(500).json({ success: false, message: 'Error creating token', error: error.message });
    }
  },
];

// Get all tokens for a specific user
const getTokensByUser = async (req, res) => {
  try {
    const tokens = await Token.find({ rollno: req.params.rollno });
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    console.error('[ERROR] Fetching User Tokens:', error);
    res.status(500).json({ success: false, message: 'Error fetching tokens', error: error.message });
  }
};

// Validate token by ID
const validateToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenID);
    if (!token) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }
    res.status(200).json({ success: true, data: token });
  } catch (error) {
    console.error('[ERROR] Validating Token:', error);
    res.status(500).json({ success: false, message: 'Error validating token', error: error.message });
  }
};

// Get all tokens (Admin use)
const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    console.error('[ERROR] Fetching All Tokens:', error);
    res.status(500).json({ success: false, message: 'Error fetching tokens', error: error.message });
  }
};

// Count tokens purchased on a specific date
const countTokensByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const tokenCount = await Token.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({
      success: true,
      message: `Tokens purchased on ${date}: ${tokenCount}`,
      tokenCount,
    });
  } catch (error) {
    console.error('[ERROR] Counting Tokens:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

//deduct the token used
const useToken = async (req, res) => {
  try {
    const { rollno, tokensToUse } = req.body;

    // Validate input
    if (!rollno || !tokensToUse || tokensToUse <= 0) {
      return res.status(400).json({ success: false, message: "Invalid request parameters" });
    }

    // Find token record for the user
    const token = await Token.findOne({ rollno });

    if (!token) {
      return res.status(404).json({ success: false, message: "User token not found" });
    }

    // Check if the user has enough tokens
    if (token.balance < tokensToUse) {
      return res.status(400).json({ success: false, message: "Not enough tokens available" });
    }

    // Deduct the tokens
    token.balance -= tokensToUse;

    // Save the updated token record
    await token.save();

    res.status(200).json({
      success: true,
      message: "Tokens used successfully",
      remainingBalance: token.balance
    });
  } catch (error) {
    console.error("[ERROR] Using Token:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get total earnings (For Admins)
const getTotalEarnings = async (req, res) => {
  try {
    const totalEarnings = await Token.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ]);

    res.status(200).json({
      success: true,
      totalEarnings: totalEarnings[0]?.total || 0,
    });
  } catch (error) {
    console.error("[ERROR] Fetching Total Earnings:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Count total tokens bought by a specific user (based on rollNo)
const countTokensByUser = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Validate roll number input
    if (!rollno) {
      return res.status(400).json({ success: false, message: "Roll number is required" });
    }

    // Count tokens for the given roll number
    const totalTokensBought = await Token.aggregate([
      { $match: { rollno } }, // Filter by roll number
      { $group: { _id: "$rollno", totalTokens: { $sum: "$balance" } } } // Sum up token balance
    ]);

    const totalTokens = totalTokensBought.length > 0 ? totalTokensBought[0].totalTokens : 0;

    res.status(200).json({
      success: true,
      message: `Total tokens bought by user ${rollno}: ${totalTokens}`,
      totalTokens
    });
  } catch (error) {
    console.error('[ERROR] Counting User Tokens:', error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Export all functions
module.exports = { createToken, getTokensByUser, validateToken, getAllTokens, buyToken, getTotalEarnings, countTokensByDate, countTotalTokens, countTokensByUser, useToken };