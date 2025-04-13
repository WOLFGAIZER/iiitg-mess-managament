const Complaint = require('../models/complaint');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Set up file storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/complaintImages/'); // Directory for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage }).single('complaintImage');

//create a complaint
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userID, tokenID, complaintText, priority, isAnonymous } = req.body;

    // 👇 Generate complaintNo manually
    const count = await Complaint.countDocuments();
    const year = new Date().getFullYear();
    const complaintNo = `COMP${year}${(count + 1).toString().padStart(4, '0')}`;

    const complaint = new Complaint({
      userID,
      tokenID,
      complaintText,
      complaintNo,
      priority,
      isAnonymous,
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



// Upload complaint image
const uploadComplaintImage = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      const { complaintNo } = req.params; // ✅
      const complaint = await Complaint.findOne({ complaintNo });

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      const imageFile = {
        fileName: req.file.filename,
        fileUrl: req.file.path,
      };

      complaint.imageAttachments.push(imageFile);
      await complaint.save();
      res.status(200).json({ message: 'Image uploaded successfully', complaint });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ timestamp: -1 });
    res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get complaints by user ID
const getComplaintsByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const complaints = await Complaint.find({ userID }).sort({ timestamp: -1 });
    res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get complaints by token ID
const getComplaintsByToken = async (req, res) => {
  try {
    const { tokenID } = req.params;
    const complaints = await Complaint.find({ tokenID }).sort({ timestamp: -1 });
    res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintNo } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findOne({ complaintNo });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    res.status(200).json({ message: 'Complaint status updated successfully', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createComplaint,
  uploadComplaintImage,
  getAllComplaints,
  getComplaintsByUser,
  getComplaintsByToken,
  updateComplaintStatus,
  upload,
};
