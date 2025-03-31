const User = require('../models/User');
const { generateOTP, sendSMS } = require('../utils/otpUtils');

// Generate and send OTP
const sendOTP = async (req, res) => {
  try {
    const { contact } = req.body;
    const otp = generateOTP();
    
    // Save OTP to user document
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
    };
    await user.save();

    // Send OTP via SMS
    await sendSMS(contact, `Your OTP is: ${otp}`);

    res.status(200).json({ 
      message: 'OTP sent successfully',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists and is valid
    if (!user.otp || !user.otp.code || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after successful verification
    await user.save();

    res.status(200).json({ 
      message: 'OTP verified successfully',
      isVerified: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

module.exports = { sendOTP, verifyOTP }; 