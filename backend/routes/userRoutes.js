const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth");
const { body, validationResult } = require('express-validator');
const { generateOTP } = require('../utils/otpUtils');

// Validation rules
const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('contact').isLength({ min: 10, max: 10 }).withMessage('Contact must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('course').isIn(['B.Tech', 'M.Tech', 'PhD']).withMessage('Invalid course'),
];

// Register a new user
router.post("/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { username, rollNo, contact, password, course } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { rollNo }, { contact }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const USERID = rollNo;
    const user = new User({ username, rollNo, contact, password: hashedPassword, course, USERID });
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Login with password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role, course: user.course },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
// Refresh token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "your-refresh-secret");
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  const { username, contact, course } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.username = username || user.username;
    user.contact = contact || user.contact;
    user.course = course || user.course;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// Send Login OTP
router.post('/send-login-otp', async (req, res) => {
  try {
    const { contact } = req.body;
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();
    console.log('OTP:', otp); // Replace with SMS in production
    res.status(200).json({ success: true, message: 'OTP sent successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
});

// Verify Login OTP
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.otp || !user.otp.code || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    user.otp = undefined;
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role, course: user.course },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
});

// Resend Login OTP
router.post('/resend-login-otp', async (req, res) => {
  try {
    const { contact } = req.body;
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();
    console.log('New OTP:', otp); // Replace with SMS in production
    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resending OTP', error: error.message });
  }
});


module.exports = router;