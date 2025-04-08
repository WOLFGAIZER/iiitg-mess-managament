const { body, validationResult } = require('express-validator');
const Token = require('../models/Token');
const { v4: uuidv4 } = require('uuid');

// Validation rules for token creation
const tokenValidationRules = [
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount required'),
  body('numberOfTokens').isInt({ min: 1 }).withMessage('At least 1 token required'),
];

// Create a new token
const createToken = [
  ...tokenValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollNo, totalAmount, numberOfTokens } = req.body;

      const newToken = new Token({
        tokenID: uuidv4(), // Generate unique token ID
        rollNo,
        totalAmount,
        numberOfTokens,
        isActive: true,
        date: new Date(), // Automatically set the date
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
    const tokens = await Token.find({ rollNo: req.params.rollNo });
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

// Buy a new token (User purchases token)
const buyToken = async (req, res) => {
  try {
    const { rollNo, totalAmount } = req.body; // Ensure consistent field names

    if (!rollNo || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Roll number and total amount are required' });
    }

    // Create a new token
    const newToken = new Token({
      tokenID: uuidv4(),
      rollNo,
      totalAmount,
      isActive: true,
      date: new Date(),
    });

    await newToken.save();

    res.status(201).json({ success: true, message: 'Token purchased successfully', token: newToken });
  } catch (error) {
    console.error('[ERROR] Buying Token:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Count tokens purchased on a specific date
const countTokensByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    // Convert string date to JavaScript Date object
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    // Count tokens within the given date range
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

// Get total earnings (For Admins)
const getTotalEarnings = async (req, res) => {
  try {
    const totalEarnings = await Token.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    if (totalEarnings.length === 0) {
      return res.status(200).json({ success: true, totalEarnings: 0 });
    }

    res.status(200).json({
      success: true,
      totalEarnings: totalEarnings[0].total,
    });
  } catch (error) {
    console.error("[ERROR] Fetching Total Earnings:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Export all functions
module.exports = { createToken, getTokensByUser, validateToken, getAllTokens, buyToken, getTotalEarnings, countTokensByDate };
