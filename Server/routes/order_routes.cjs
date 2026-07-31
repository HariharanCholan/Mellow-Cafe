const express = require('express');
const Order = require('../models/Orders.cjs');
const User = require('../models/User.cjs');
const GoogleUser = require('../models/googleUserModel.cjs');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userEmail, items, total } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email missing" });
    }

    // Check normal user
    let user = await User.findOne({ email: userEmail });

    // If not found → check google user
    if (!user) {
      const googleUser = await GoogleUser.findOne({ email: userEmail });
      if (!googleUser) {
        return res.status(400).json({ message: 'User does not exist' });
      }
      user = googleUser; // ← THIS WAS MISSING
    }

    // Create the order
    const order = await Order.create({
      userEmail,
      items,
      total,
    });

    res.status(201).json({ message: 'Order placed', order });

  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: 'Order error', error: err });
  }
});

module.exports = router;
