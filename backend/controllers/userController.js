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

module.exports = { getAllUsers, createUser };