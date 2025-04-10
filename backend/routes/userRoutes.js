const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.createUser);
router.get("/all", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
// Get a user by Roll Number
router.get("/rollno/:rollno", userController.getUserByRollNo);


module.exports = router;
