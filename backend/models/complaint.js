const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userID: { type: String, required: true }, // References User.rollNo or _id
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);