const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, enum: ['main', 'side', 'dessert', 'beverage'], required: true },
  quantity: { type: String, required: true }
});

const mealSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  mealType: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner'], 
    required: true 
  },
  menu: [menuItemSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true }, // Admin username
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);