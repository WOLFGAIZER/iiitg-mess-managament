const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  createComplaint,
  getComplaintsByToken,
  uploadComplaintImage,
  updateComplaintStatus
} = require('../controllers/complaintController');

const { authenticateToken, restrictToAdmin } = require('../middleware/auth');
const multer = require('multer');

// Multer setup for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all complaints (admin only)
router.get('/', authenticateToken, restrictToAdmin, getAllComplaints);

// Create a new complaint (authenticated users)
router.post('/', authenticateToken, createComplaint);

// Get complaints by tokenID (authenticated users)
router.get('/token/:tokenID', authenticateToken, getComplaintsByToken);

// Upload an image for a complaint (authenticated users)
router.post('/upload-image/:complaintID', authenticateToken, uploadComplaintImage);

// Update complaint status (admin only)
router.patch('/update-status/:complaintID', authenticateToken, restrictToAdmin, updateComplaintStatus);

module.exports = router;
