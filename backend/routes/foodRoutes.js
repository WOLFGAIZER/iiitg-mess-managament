const express = require('express');
const router = express.Router();
const { getAllFood, createFood } = require('../controllers/foodController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, getAllFood);
router.post('/', authenticateToken, restrictToAdmin, createFood);

module.exports = router;