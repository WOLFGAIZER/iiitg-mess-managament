const { body, validationResult } = require('express-validator');
const QR = require('../models/qrModel');

const qrValidationRules = [
  body('tokenID').notEmpty().withMessage('Token ID is required'),
  body('qrData').notEmpty().withMessage('QR data is required'),
  body('expiresAt').isISO8601().withMessage('Valid expiry date required'),
];

const getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QR.find();
    res.status(200).json({ success: true, data: qrCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching QR codes', error: error.message });
  }
};

const deleteExpiredQRCodes = async (req, res) => {
  try {
    const currentDate = new Date();
    const result = await QR.deleteMany({ expiresAt: { $lt: currentDate } }); // Delete old QR codes
    res.status(200).json({ success: true, message: 'Expired QR codes deleted', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting expired QR codes', error: error.message });
  }
};

const createQRCode = [
  ...qrValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { tokenID, qrData, expiresAt } = req.body;
      const newQR = new QR({ tokenID, qrData, expiresAt });
      await newQR.save();
      res.status(201).json({ success: true, message: 'QR code created', data: newQR });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating QR code', error: error.message });
    }
  },
];

module.exports = { getAllQRCodes, createQRCode, deleteExpiredQRCodes };