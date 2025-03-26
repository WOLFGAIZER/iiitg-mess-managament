const express = require('express');
const router = express.Router();
const { getAllBills, createBill, getBillByToken } = require('../controllers/billController');

// Get all bills
router.get('/', getAllBills);

// Create new bill
router.post('/', createBill);

// Get bill by tokenID
router.get('/token/:tokenID', getBillByToken);

module.exports = router;