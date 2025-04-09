const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenID: { type: String, required: true, unique: true },
  rollno: { type: String, required: true, unique: true }, // Remove unique constraint
  price: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
