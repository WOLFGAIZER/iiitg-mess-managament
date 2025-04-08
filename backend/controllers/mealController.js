const { body, validationResult } = require('express-validator');
const Meal = require('../models/Meal');

const mealValidationRules = [
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('meal_time').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
  body('menu_items').isArray({ min: 1 }),
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
      const { day, meal_time, menu_items } = req.body;
      const newMeal = new Meal({ day, meal_time, menu_items });
      await newMeal.save();
      res.status(201).json({ success: true, message: 'Meal created', data: newMeal });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating meal', error: error.message });
    }
  },
];

module.exports = { getMeals, createMeal };