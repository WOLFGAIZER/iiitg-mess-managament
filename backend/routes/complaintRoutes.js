const express = require('express');
const router = express.Router();
const { getAllComplaints, createComplaint, getComplaintsByToken } = require('../controllers/complaintController');
const { authenticateToken, restrictToAdmin } = require('../middleware/auth');

// Get all complaints (admin only)
router.get('/', authenticateToken, restrictToAdmin, getAllComplaints);

// Create a new complaint (authenticated users)
router.post('/', authenticateToken, createComplaint);

// Get complaints by tokenID (authenticated users)
router.get('/token/:tokenID', authenticateToken, getComplaintsByToken);

module.exports = router;