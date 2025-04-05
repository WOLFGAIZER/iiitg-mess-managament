// const express = require('express');
// const router = express.Router();
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Payment = require('../models/Payment');
// const { authenticateToken } = require('../middleware/auth');
// const { body, validationResult } = require('express-validator');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Create order
// router.post('/create-order', auth, async (req, res) => {
//   try {
//     const { amount, notes } = req.body;

//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency: 'INR',
//       receipt: `rcpt_${Date.now()}`,
//       notes: {
//         ...notes,
//         userId: req.user._id
//       }
//     };

//     const order = await razorpay.orders.create(options);

//     // Save order details
//     const payment = new Payment({
//       userId: req.user._id,
//       orderId: order.id,
//       amount: amount,
//       notes: notes,
//       status: 'created'
//     });

//     await payment.save();

//     res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       order: order
//     });

//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order'
//     });
//   }
// });

// // Verify payment
// router.post('/verify-payment', auth, async (req, res) => {
//   try {
//     const { orderId, paymentId, signature } = req.body;

//     // Verify signature
//     const body = orderId + "|" + paymentId;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     if (expectedSignature !== signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid signature'
//       });
//     }

//     // Update payment status
//     const payment = await Payment.findOneAndUpdate(
//       { orderId: orderId },
//       {
//         status: 'paid',
//         paymentId: paymentId,
//         signature: signature
//       },
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.json({
//       success: true,
//       payment: payment
//     });

//   } catch (error) {
//     console.error('Verify payment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Payment verification failed'
//     });
//   }
// });

// module.exports = router; 