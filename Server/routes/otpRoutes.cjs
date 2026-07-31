const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer.cjs");

// 🔐 Use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/* ---------------------------------------------------
   SEND OTP (EMAIL)
----------------------------------------------------- */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Create JWT token
    const token = jwt.sign(
      { email, otp },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    // 📧 Send Email using mailer
    await sendEmail({
      to: email,
      subject: "Your OTP Code ☕",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ token });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ---------------------------------------------------
   VERIFY OTP
----------------------------------------------------- */
router.post("/verify-otp", (req, res) => {
  const { otp, token } = req.body;

  if (!otp || !token) {
    return res.status(400).json({ message: "OTP and token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({
      message: "OTP Verified",
      email: decoded.email,
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(400).json({ message: "OTP expired or invalid" });
  }
});

module.exports = router;