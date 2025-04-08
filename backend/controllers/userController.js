const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userValidationRules = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('USERID').notEmpty().withMessage('USERID is required'),
  body('course').isIn(['B.Tech', 'M.Tech', 'PhD']).withMessage('Invalid course'),
];

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};

const createUser = [
  ...userValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username, password, USERID, course } = req.body;

      // Check if the USERID already exists
      const existingUser = await User.findOne({ USERID });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'USERID already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, USERID, course });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, USERID: newUser.USERID },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ 
        success: true, 
        message: 'User registered', 
        data: { username, course }, 
        token 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
  },
];

/**
 * @desc User Login
 * @route POST /users/login
 * @access Public
 */
const loginUser = async (req, res) => {
  const { USERID, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ USERID });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid USERID or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid USERID or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, USERID: user.USERID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        username: user.username,
        USERID: user.USERID,
        course: user.course,
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

module.exports = { getAllUsers, createUser, loginUser };
