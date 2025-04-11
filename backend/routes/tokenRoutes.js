const express = require("express");
const router = express.Router();
const { 
  createToken, 
  buyToken, 
  getAllTokens, 
  getTokensByUser, 
  useToken, 
  validateToken, 
  countTotalTokens, 
  getTotalEarnings 
} = require("../controllers/tokenController");

// ✅ Create a token
router.post("/create", createToken);

// ✅ Buy a token
router.post("/buy", buyToken);

// ✅ Get all tokens
router.get("/", getAllTokens);

// ✅ Get tokens by user roll number
router.get("/user/:rollno", getTokensByUser);

// ✅ Validate a token
router.get("/validate/:tokenID", validateToken);

// ✅ Count total tokens
router.get("/count-total", countTotalTokens);

// ✅ Get total earnings
router.get("/total-earnings", getTotalEarnings);

// ✅ Use tokens
router.post("/use", useToken);

module.exports = router;
