const express = require('express');
const router = express.Router();
const { getAllFood, createFood, getWeeklyMenu, getTodaysMenu } = require('../controllers/foodController');


router.get('/today', getTodaysMenu); // Route for today's menu
router.get('/week', getWeeklyMenu); // Route for full week's menu
router.get('/', getAllFood);
router.post('/', createFood);

module.exports = router;