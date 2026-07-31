const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User.cjs");

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // ❌ If user already registered with Google
      if (existingUser.provider === "google") {
        return res.status(400).json({
          message: "This email is already registered using Google. Please login with Google.",
        });
      }

      // ❌ Normal duplicate
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    // 🔐 Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      provider: "local",
    });

    res.status(201).json({
      message: "User registered",
      user,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No account found" });
    }

    // ❌ If Google account tries password login
    if (user.provider === "google") {
      return res.status(400).json({
        message: "This account was created using Google. Please login with Google.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Login success",
      user,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- GOOGLE LOGIN ---------------- */
router.post("/google-login", async (req, res) => {
  try {
    console.log("Incoming:", req.body); // DEBUG

    const { email, name, picture } = req.body;

    // 🔒 Safety check
    if (!email) {
      return res.status(400).json({
        message: "Email missing from Google",
      });
    }

    let user = await User.findOne({ email });

    // ✅ If user exists → login
    if (user) {
      return res.json({
        message: "Google login success",
        user,
      });
    }

    // ✅ Create new user
    user = await User.create({
      name,
      email,
      provider: "google",
      picture,
    });

    res.json({
      message: "Google login success",
      user,
    });

  } catch (err) {
    console.error("🔥 FULL ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;