const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otpController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router; 