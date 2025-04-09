const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.createUser);
router.get("/all", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);

module.exports = router;
