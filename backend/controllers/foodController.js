const { body, validationResult } = require('express-validator');
const Food = require('../models/Food');

const foodValidationRules = [
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('menu').notEmpty().withMessage('Menu is required'),
];

const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find().populate('createdBy', 'username');
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching food items', error: error.message });
  }
};

// Get full week's menu
const getWeeklyMenu = async (req, res) => {
  try {
    const foods = await Food.find().sort({ day: 1 }).populate('createdBy', 'username'); // Sort by day
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching weekly menu', error: error.message });
  }
};

const createFood = [
  ...foodValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { day, menu } = req.body;
      const newFood = new Food({ day, menu, createdBy: req.user.id });
      await newFood.save();
      res.status(201).json({ success: true, message: 'Food item created', data: newFood });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating food item', error: error.message });
    }
  },
];

const getTodaysMenu = async (req, res) => {
  try {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // Get current day name
    const food = await Food.findOne({ day: today }).populate('createdBy', 'username');

    if (!food) {
      return res.status(404).json({ success: false, message: `No menu found for ${today}` });
    }

    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching today\'s menu', error: error.message });
  }
};

module.exports = { getAllFood, createFood, getWeeklyMenu, getTodaysMenu };