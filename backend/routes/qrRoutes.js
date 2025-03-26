const express = require('express');
const router = express.Router();
const { getAllQRCodes, createQRCode } = require('../controllers/qrController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');

// Get all QR codes (admin only)
router.get('/', authenticateToken, restrictToAdmin, getAllQRCodes);

// Create a new QR code (authenticated users)
router.post('/', authenticateToken, createQRCode);

module.exports = router;