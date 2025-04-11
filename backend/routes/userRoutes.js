const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ✅ Create a new user
router.post("/create", userController.createUser);

// ✅ Get all users
router.get("/all", userController.getAllUsers);

// ✅ Get a user by EmailID
router.get("/email/:email", userController.getUserByEmail);

// ✅ Get a user by USERID
router.get("/id/:userid", userController.getUserByID);

// ✅ Get a user by Roll Number
router.get("/rollno/:rollno", userController.getUserByRollNo);

// ✅ Get token transaction history by Roll Number
router.get("/token-history/rollno/:rollno", userController.getTokenHistoryByRollNo);

module.exports = router;
