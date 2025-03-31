const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const { status, category, timeFrame, sort } = req.query;
    
    // Build query
    let query = {};
    
    // Add filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Add time frame filter
    if (timeFrame && timeFrame !== 'all') {
      const now = new Date();
      switch (timeFrame) {
        case 'today':
          query.timestamp = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case 'week':
          query.timestamp = { $gte: new Date(now.setDate(now.getDate() - 7)) };
          break;
        case 'month':
          query.timestamp = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
          break;
      }
    }

    // Build sort options
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { timestamp: 1 };
        break;
      case 'priority':
        sortOption = { priority: -1, timestamp: -1 };
        break;
      default: // newest
        sortOption = { timestamp: -1 };
    }

    const complaints = await Complaint
      .find(query)
      .sort(sortOption)
      .populate('responses.responder', 'name role');

    res.json(complaints);
  } catch (error) {
    console.error('Fetch complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/submit', auth, upload.single('attachment'), async (req, res) => {
  try {
    const { complaintText, category, priority, isAnonymous } = req.body;

    // Validate input
    if (!complaintText || !complaintText.trim()) {
      return res.status(400).json({ message: 'Complaint text is required' });
    }

    if (complaintText.length > 1000) {
      return res.status(400).json({ message: 'Complaint text cannot exceed 1000 characters' });
    }

    // Create new complaint
    const complaint = new Complaint({
      username: isAnonymous ? 'Anonymous' : req.user.name,
      userID: req.user._id,
      complaintText: complaintText.trim(),
      category,
      priority,
      isAnonymous: isAnonymous === 'true',
      status: 'Pending'
    });

    // Add attachment if present
    if (req.file) {
      complaint.attachments = [{
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedAt: new Date()
      }];
    }

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });

  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ message: 'Failed to submit complaint' });
  }
});

module.exports = router; 