const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  tokenID: { type: String, required: true, unique: true },
  qrData: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('QR', qrSchema); 