const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.post("/create", receiptController.createReceipt);
router.get("/all", receiptController.getAllReceipts);
router.get("/:tokenID", receiptController.getReceiptById);

module.exports = router;
