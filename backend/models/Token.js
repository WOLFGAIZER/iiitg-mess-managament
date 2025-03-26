const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenID: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);