const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const tokenSchema = new mongoose.Schema({
  tokenID: { type: String, default: uuidv4, unique: true }, // Unique token identifier
  rollno: { type: String, required: true }, // Student's roll number
  price: { type: Number, required: true }, // Price per token
  balance: { type: Number, default: 0 }, // Number of tokens user has
  isActive: { type: Boolean, default: true }, // Token status
  date: { type: Date, default: Date.now }, // Token creation date
  createdAt: { type: Date, default: Date.now },
  month: { type: String, required: true }
});

module.exports = mongoose.model("Token", tokenSchema);
