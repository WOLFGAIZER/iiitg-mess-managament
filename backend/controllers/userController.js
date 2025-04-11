const User = require("../models/User");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");

//create user
const createUser = async (req, res) => {
    try {
        const { username, password, EmailID, course, rollNo } = req.body;

        // Check if email or roll number already exists
        const existingUser = await User.findOne({ $or: [{ EmailID }, { rollNo }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Roll Number already registered" });
        }

        // Ensure USERID is generated
        const newUser = new User({
            USERID: uuidv4(),  // Ensure UUID is generated
            rollNo,
            username,
            password,
            EmailID,
            course
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};

// ✅ Get a single user by EmailID
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

// ✅ Get a single user by USERID
const getUserByID = async (req, res) => {
    try {
        const user = await User.findOne({ USERID: req.params.userid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

// ✅ Get a single user by Roll Number
const getUserByRollNo = async (req, res) => {
    try {
        const user = await User.findOne({ rollNo: req.params.rollno });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

// ✅ Fetch token transaction history by Roll Number
const getTokenHistoryByRollNo = async (req, res) => {
    try {
        const { rollno } = req.params;

        if (!rollno) {
            return res.status(400).json({ success: false, message: "Roll number is required" });
        }

        // Find token transactions for given Roll Number
        const tokenHistory = await Token.find({ rollNo: rollno }).sort({ date: -1 });

        if (tokenHistory.length === 0) {
            return res.status(404).json({ success: false, message: "No token history found for this user" });
        }

        res.status(200).json({ success: true, message: `Token history for user ${rollno}`, data: tokenHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching token history", error: error.message });
    }
};

// ✅ Export all controller functions
module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    getUserByID,
    getUserByRollNo,
    getTokenHistoryByRollNo
};
