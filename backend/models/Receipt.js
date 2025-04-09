const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
    TokenID: { type: String, required: true, unique: true },
    Price: { type: Number, required: true },
    Rollno: { type: String, required: true },
    Amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Receipt", ReceiptSchema);
