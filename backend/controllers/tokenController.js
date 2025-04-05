const { body, validationResult } = require('express-validator');
const Token = require('../models/Token');
const { v4: uuidv4 } = require('uuid');

const tokenValidationRules = [
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount required'),
  body('numberOfTokens').isInt({ min: 1 }).withMessage('At least 1 token required'),
];

const createToken = [
  ...tokenValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollNo, totalAmount, numberOfTokens } = req.body;
      const newToken = new Token({ rollNo, totalAmount, numberOfTokens });
      await newToken.save();
      res.status(201).json({ success: true, message: 'Token created', data: newToken });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating token', error: error.message });
    }
  },
];

const getTokensByUser = async (req, res) => {
  try {
    const tokens = await Token.find({ rollNo: req.params.rollNo });
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tokens', error: error.message });
  }
};

const validateToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenID);
    if (!token) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }
    res.status(200).json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error validating token', error: error.message });
  }
};

const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tokens', error: error.message });
  }
};
const buyToken = async (req, res) => {
  try {
    const { rollno, price } = req.body; // Get roll number and price

    if (!rollno || !price) {
      return res.status(400).json({ success: false, message: 'Roll number and price are required' });
    }

    // Create new token
    const newToken = new Token({
      tokenID: uuidv4(), // Generate unique token ID
      rollno,
      price,
      isActive: true,
      date: new Date() // Server-generated date
    });

    // Save token to database
    await newToken.save();

    res.status(201).json({ success: true, message: 'Token purchased successfully', token: newToken });
  } catch (error) {
    console.error('[ERROR] Buying Token:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { createToken, getTokensByUser, validateToken, getAllTokens,buyToken };