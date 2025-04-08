const { body, validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");

//Create a complaint
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userID, message, tokenID } = req.body;

    if (!userID || !message || !tokenID) {
      return res.status(400).json({ success: false, message: "UserID, TokenID, and Message are required" });
    }

    const imagePath = req.file ? req.file.path : null; // Save uploaded image path (if any)

    const newComplaint = new Complaint({
      userID,
      message,
      tokenID,
      image: imagePath,  // Store image path in DB
      status: "PENDING", // Default status
    });

    await newComplaint.save();

    res.status(201).json({ success: true, message: "Complaint registered successfully", data: newComplaint });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering complaint", error: error.message });
  }
};

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg images are allowed"), false);
  }
};

// Upload Middleware
const upload = multer({ storage, fileFilter });

const complaintValidationRules = [
  body("userID").notEmpty().withMessage("User ID is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching complaints", error: error.message });
  }
};

// upload a imamge to complaint
const uploadComplaintImage = async (req, res) => {
  try {
    const complaintID = req.params.complaintID;
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintID,
      { $set: { image: imagePath } },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, message: 'Image uploaded successfully', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading image', error: error.message });
  }
};

// Get Complaints by User ID
const getComplaintsByUser = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userID: req.params.userID });
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching complaints", error: error.message });
  }
};

// Get complaints by tokens
const getComplaintsByToken = async (req, res) => {
  try {
      const tokenID = req.params.tokenID;
      const complaints = await Complaint.find({ tokenID });

      if (!complaints.length) {
          return res.status(404).json({ success: false, message: 'No complaints found for this token' });
      }

      res.status(200).json({ success: true, data: complaints });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["PENDING", "UNDER PROGRESS", "COMPLETE"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.complaintID,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Status updated successfully", data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};

module.exports = {
  getAllComplaints,
  createComplaint,
  uploadComplaintImage,
  getComplaintsByUser,
  updateComplaintStatus,
  getComplaintsByToken,
};
