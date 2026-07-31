const express = require('express');
const User = require('../models/User.cjs');
const GoogleUser = require('../models/googleUserModel.cjs');
const Order = require('../models/Orders.cjs');

const router = express.Router();

/* -------------------- GET USER ORDERS (PUT THIS FIRST) -------------------- */
router.get('/orders/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ userEmail: email }).sort({ timestamp: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Orders fetch error', error: err });
  }
});

/* -------------------- GET USER PROFILE -------------------- */
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;

    let user = await User.findOne({ email });

    if (!user) {
      const googleUser = await GoogleUser.findOne({ email });
      if (!googleUser) {
        return res.status(404).json({ message: "User not found" });
      }

      user = {
        name: googleUser.name,
        email: googleUser.email,
        phone: null,
        picture: googleUser.picture,
        address: null,
        createdAt: googleUser.createdAt,
        type: "google"
      };

      return res.json({ profile: user });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      picture: null,
      address: null,
      createdAt: null,
      type: "normal"
    };

    return res.json({ profile: profileData });

  } catch (err) {
    res.status(500).json({ message: 'Profile fetch error', error: err });
  }
});
module.exports = router;
