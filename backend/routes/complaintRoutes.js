const express = require("express");
const router = express.Router();
const path = require("path"); // For handling file paths
const {
  getAllComplaints,
  createComplaint,
  uploadComplaintImage,
  getComplaintsByUser,
  updateComplaintStatus,
  getComplaintsByToken,
} = require("../controllers/complaintController");
const multer = require("multer");

// ✅ Multer Storage Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/complaintImages/"); // Store images in the 'uploads/complaintImages' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name using timestamp
  },
});

const upload = multer({ storage });

// ✅ **Complaint Routes**

// 🟢 Get all complaints (Admin only)
router.get("/allcomplaints", getAllComplaints);

// 🟢 Create a new complaint
router.post("/create", createComplaint);

// 🟢 Get complaints by User ID
router.get("/user/:userID", getComplaintsByUser);

// 🟢 Get complaints by Token ID
router.get("/token/:tokenID", getComplaintsByToken);

// 🟢 Upload an image for a complaint
router.post("/upload-image/:complaintNo", uploadComplaintImage); // ✅

// 🟢 Update complaint status (Admin only)
router.patch("/update-status/:complaintNo", updateComplaintStatus);

module.exports = router;
