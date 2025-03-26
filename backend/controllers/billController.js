const { body, validationResult } = require('express-validator');
const Bill = require('../models/Bill');

const billValidationRules = [
  body('tokenID').notEmpty().withMessage('Token ID is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
];

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
};

const createBill = [
  ...billValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { tokenID, username, course, amount } = req.body;
      const existingBill = await Bill.findOne({ tokenID });
      if (existingBill) return res.status(400).json({ message: 'Bill with this tokenID already exists' });

      const newBill = new Bill({ tokenID, username, course, amount });
      await newBill.save();
      res.status(201).json({ message: 'Bill created successfully', bill: newBill });
    } catch (error) {
      res.status(500).json({ message: 'Error creating bill', error: error.message });
    }
  },
];

// Get bills by tokenID
const getBillByToken = async (req, res) => {
  try {
    const bill = await Bill.findOne({ tokenID: req.params.tokenID });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill', error: error.message });
  }
};

module.exports = { getAllBills, createBill, getBillByToken };