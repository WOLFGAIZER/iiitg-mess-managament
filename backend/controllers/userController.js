const User = require("../models/User");

// Create a new user
const createUser = async (req, res) => {
    try {
        const { username, password, EmailID, course } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ EmailID });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Create a new user
        const newUser = new User({ username, password, EmailID, course });
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};

// Get a single user by EmailID
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ EmailID: req.params.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

// Get a single user by Roll Number
const getUserByRollNo = async (req, res) => {
  try {
      const user = await User.findOne({ rollNo: req.params.rollno }); // Find user by roll number
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

// Fetch token transaction history by Roll Number
const getTokenHistoryByRollNo = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Validate roll number input
    if (!rollno) {
      return res.status(400).json({ success: false, message: "Roll number is required" });
    }

    // Find all token transactions for the given roll number
    const tokenHistory = await Token.find({ rollno }).sort({ date: -1 }); // Sort by newest first

    if (tokenHistory.length === 0) {
      return res.status(404).json({ success: false, message: "No token history found for this roll number" });
    }

    res.status(200).json({
      success: true,
      message: `Token history for user ${rollno}`,
      data: tokenHistory
    });
  } catch (error) {
    console.error('[ERROR] Fetching Token History:', error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Export all controller functions correctly
module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    getUserByRollNo
};
