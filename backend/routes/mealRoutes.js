const express = require('express');
const router = express.Router();
const { getMeals, createMeal } = require('../controllers/mealController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');

// Get all meals (authenticated users)
router.get('/', authenticateToken, getMeals);

// Create a new meal (admin only)
router.post('/', authenticateToken, restrictToAdmin, createMeal);

module.exports = router;