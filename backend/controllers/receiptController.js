const Receipt = require("../models/Receipt");

// Create a new receipt
exports.createReceipt = async (req, res) => {
    try {
        const { TokenID, Price, Rollno, Amount } = req.body;
        const newReceipt = new Receipt({ TokenID, Price, Rollno, Amount });
        await newReceipt.save();
        res.status(201).json({ success: true, message: "Receipt created successfully", receipt: newReceipt });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating receipt", error: error.message });
    }
};

// Get all receipts
exports.getAllReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find();
        res.status(200).json({ success: true, receipts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching receipts", error: error.message });
    }
};

// Get a single receipt by TokenID
exports.getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findOne({ TokenID: req.params.tokenID });
        if (!receipt) {
            return res.status(404).json({ success: false, message: "Receipt not found" });
        }
        res.status(200).json({ success: true, receipt });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching receipt", error: error.message });
    }
};

// Count total number of receipts
exports.countTotalReceipts = async (req, res) => {
  try {
    const totalReceipts = await Receipt.countDocuments(); // Count all receipts

    res.status(200).json({
      success: true,
      message: `Total number of receipts: ${totalReceipts}`,
      totalReceipts
    });
  } catch (error) {
    console.error('[ERROR] Counting Receipts:', error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
