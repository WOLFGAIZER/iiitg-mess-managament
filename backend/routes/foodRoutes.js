const express = require('express');
const router = express.Router();
const { getAllFood, createFood, getWeeklyMenu, getTodaysMenu } = require('../controllers/foodController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');


router.get('/today', getTodaysMenu); // Route for today's menu
router.get('/week', getWeeklyMenu); // Route for full week's menu
router.get('/', authenticateToken, getAllFood);
router.post('/', authenticateToken, restrictToAdmin, createFood);

module.exports = router;