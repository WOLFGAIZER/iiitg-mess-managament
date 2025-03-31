const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateOTP } = require('../utils/otpUtils');

// Send Login OTP
router.post('/send-login-otp', async (req, res) => {
  try {
    const { contact } = req.body;
    
    // Find user by phone number
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to user document
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    };
    await user.save();

    // In production, send OTP via SMS
    console.log('OTP:', otp); // For development only

    res.status(200).json({ 
      message: 'OTP sent successfully',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Verify Login OTP
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (!user.otp || !user.otp.code || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

// Resend Login OTP
router.post('/resend-login-otp', async (req, res) => {
  try {
    const { contact } = req.body;
    
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };
    await user.save();

    // In production, send OTP via SMS
    console.log('New OTP:', otp); // For development only

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resending OTP', error: error.message });
  }
});

module.exports = router;
