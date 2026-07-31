const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Orders.cjs");
const generateInvoice = require("../utils/generateInvoice.cjs");

const router = express.Router();

// 🔥 DEBUG (IMPORTANT)
console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ✅ 1. Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 2. Verify Payment + Save Order + Generate Invoice
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    totalAmount,
    userEmail,
  } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const order = new Order({
      items,
      totalAmount,
      paymentId: razorpay_payment_id,
      userEmail,
    });

    const savedOrder = await order.save();

    const invoiceFile = generateInvoice(savedOrder);

    res.json({
      success: true,
      invoiceUrl: `http://localhost:5000/invoices/${invoiceFile}`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;