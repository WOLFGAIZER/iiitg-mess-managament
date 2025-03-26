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

module.exports = { getAllFood, createFood };