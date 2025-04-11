const express = require('express');
const router = express.Router();
const { getMeals, createMeal } = require('../controllers/mealController');

// Get all meals (No authentication required)
router.get('/meals', getMeals);

// Create a new meal (No authentication required)
router.post('/create', createMeal);

module.exports = router;
