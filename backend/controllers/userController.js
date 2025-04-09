const User = require("../models/User");

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, password, EmailID, Course } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ EmailID });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Create a new user
        const newUser = new User({ username, password, EmailID, Course });
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};

// Get a single user by EmailID
exports.getUserByEmail = async (req, res) => {
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
