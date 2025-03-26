const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  tokenID: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', billSchema);

//need modification