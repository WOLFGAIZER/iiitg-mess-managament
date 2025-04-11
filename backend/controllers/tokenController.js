const { body, validationResult } = require("express-validator");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");

// ✅ Validation rules
const tokenValidationRules = [
  body("rollno").notEmpty().withMessage("Roll number is required"),
  body("totalAmount").isNumeric().withMessage("Valid amount required")
];

// ✅ Create a new token (Admin use)
const createToken = [
  ...tokenValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollno, totalAmount, numberOfTokens } = req.body;

      const newToken = new Token({
        tokenID: uuidv4(),
        rollno,
        price: totalAmount / numberOfTokens, // Price per token
        balance: numberOfTokens, // Tokens count
        isActive: true
      });

      await newToken.save();
      res.status(201).json({ success: true, message: "Token created", data: newToken });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating token", error: error.message });
    }
  }
];

// ✅ Buy token (students)
const buyToken = [
  ...tokenValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { rollno, totalAmount } = req.body;
      const tokenValue = Math.floor(totalAmount / 10); // 1 Token = ₹10

      // Find or create token entry for user
      let token = await Token.findOneAndUpdate(
        { rollno },
        { $inc: { balance: tokenValue } },
        { new: true, upsert: true }
      );

      res.status(200).json({ success: true, message: "Tokens added successfully", token });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error buying tokens", error: error.message });
    }
  }
];

// ✅ Get all tokens (Admin)
const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching tokens", error: error.message });
  }
};

// ✅ Get a user's tokens
const getTokensByUser = async (req, res) => {
  try {
    const tokens = await Token.find({ rollno: req.params.rollno });
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching tokens", error: error.message });
  }
};

// ✅ Use tokens (students)
const useToken = async (req, res) => {
  try {
    const { rollno, tokensToUse } = req.body;

    if (!rollno || !tokensToUse || tokensToUse <= 0) {
      return res.status(400).json({ success: false, message: "Invalid token usage request" });
    }

    const token = await Token.findOne({ rollno });
    if (!token) {
      return res.status(404).json({ success: false, message: "User token not found" });
    }

    if (token.balance < tokensToUse) {
      return res.status(400).json({ success: false, message: "Not enough tokens available" });
    }

    token.balance -= tokensToUse;
    await token.save();

    res.status(200).json({ success: true, message: "Tokens used successfully", remainingBalance: token.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error using token", error: error.message });
  }
};

// ✅ Validate a token by ID
const validateToken = async (req, res) => {
  try {
    const token = await Token.findOne({ tokenID: req.params.tokenID });
    if (!token) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }
    res.status(200).json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error validating token", error: error.message });
  }
};

// ✅ Count total tokens
const countTotalTokens = async (req, res) => {
  try {
    const totalTokens = await Token.countDocuments();
    res.status(200).json({ success: true, message: `Total number of tokens: ${totalTokens}`, totalTokens });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Get total earnings
const getTotalEarnings = async (req, res) => {
  try {
    const totalEarnings = await Token.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]);
    res.status(200).json({ success: true, totalEarnings: totalEarnings[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Export controllers
module.exports = { 
  createToken, 
  buyToken, 
  getAllTokens, 
  getTokensByUser, 
  useToken, 
  validateToken, 
  countTotalTokens, 
  getTotalEarnings 
};
