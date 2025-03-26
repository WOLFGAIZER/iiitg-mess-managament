const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

const complaintValidationRules = [
  body('userID').notEmpty().withMessage('User ID is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching complaints', error: error.message });
  }
};

const createComplaint = [
  ...complaintValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { userID, message } = req.body;
      const newComplaint = new Complaint({ userID, message });
      await newComplaint.save();
      res.status(201).json({ success: true, message: 'Complaint registered', data: newComplaint });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering complaint', error: error.message });
    }
  },
];

const getComplaintsByToken = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userID: req.params.userID });
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching complaints', error: error.message });
  }
};

module.exports = { getAllComplaints, createComplaint, getComplaintsByToken };