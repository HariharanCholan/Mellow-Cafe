const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.cjs");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const SUPER_ADMIN_EMAIL = "hariiiiii0519@gmail.com";

/** Helper: signs a JWT and ensures super_admin email always gets that role */
async function signTokenForUser(user) {
  // Force super_admin role for the designated email
  let role = user.role || "user";
  if (user.email === SUPER_ADMIN_EMAIL && role !== "super_admin") {
    role = "super_admin";
    await User.findByIdAndUpdate(user._id, { role: "super_admin" });
  }

  const payload = {
    userId: user._id,
    email: user.email,
    name: user.name,
    role,
    picture: user.picture || null,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { token, role };
}

/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.provider === "google") {
        return res.status(400).json({
          message: "This email is already registered using Google. Please login with Google.",
        });
      }
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      provider: "local",
    });

    res.status(201).json({ message: "User registered", user });
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

    if (user.provider === "google") {
      return res.status(400).json({
        message: "This account was created using Google. Please login with Google.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const { token, role } = await signTokenForUser(user);

    res.json({
      message: "Login success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- GOOGLE LOGIN ---------------- */
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email missing from Google" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, provider: "google", picture });
    }

    const { token, role } = await signTokenForUser(user);

    res.json({
      message: "Google login success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role,
      },
    });
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;