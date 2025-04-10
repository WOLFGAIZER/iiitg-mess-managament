const express = require('express');
const router = express.Router();
const { getMeals, createMeal } = require('../controllers/mealController');

// Get all meals (No authentication required)
router.get('/', getMeals);

// Create a new meal (No authentication required)
router.post('/', createMeal);

module.exports = router;
