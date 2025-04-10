const { body, validationResult } = require('express-validator');
const Meal = require('../models/Meal');

const mealValidationRules = [
  body('date').isISO8601().withMessage('Invalid date format (YYYY-MM-DD)'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner']).withMessage('Invalid meal type'),
  body('menu').isArray({ min: 1 }).withMessage('Menu must have at least one item'),
  body('createdBy').notEmpty().withMessage('createdBy (admin username) is required')
];

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find().sort('date');
    res.status(200).json({ success: true, data: meals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching meals', error: error.message });
  }
};

const createMeal = [
  ...mealValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      let { date, mealType, menu, createdBy } = req.body;

      // Convert date string to Date object
      date = new Date(date);
      if (isNaN(date)) {
        return res.status(400).json({ success: false, message: 'Invalid date format' });
      }

      const newMeal = new Meal({ date, mealType, menu, createdBy });
      await newMeal.save();

      res.status(201).json({ success: true, message: 'Meal created', data: newMeal });
    } catch (error) {
      console.error('[ERROR] Creating Meal:', error);
      res.status(500).json({ success: false, message: 'Error creating meal', error: error.message });
    }
  }
];

module.exports = { getMeals, createMeal };
