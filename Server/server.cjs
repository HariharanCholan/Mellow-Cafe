const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ✅ FORCE LOAD ENV FROM SERVER FOLDER
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

// 🔍 DEBUG (remove later)
console.log("📁 ENV PATH:", path.resolve(__dirname, ".env"));
console.log("🔐 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔐 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

// Firebase admin
require('./config/firebaseAdmin.cjs');

// Models
const User = require('./models/User.cjs');

// Routes
const profileRoutes = require('./routes/profile_routes.cjs');
const authRoutes = require('./routes/authroutes.cjs');
const orderRoutes = require('./routes/order_routes.cjs');
const paymentRoutes = require('./routes/paymentRoutes.cjs');
const otpRoutes = require('./routes/otpRoutes.cjs'); // ✅ ADDED

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// ✅ ROUTES (UNCHANGED)
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ OTP ROUTES (NEW - DO NOT CHANGE PATH)
app.use('/', otpRoutes);

// ✅ SERVE INVOICE FILES (UNCHANGED)
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Default admin (UNCHANGED)
async function createDefaultAdmin() {
  const bcrypt = require('bcrypt');
  const admin = await User.findOne({ email: 'admin01@example.com' });

  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin01@example.com',
      phone: '',
      password: hashed,
      role: 'admin'
    });
    console.log("Default Admin Created");
  }
}

createDefaultAdmin();

// Start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));