const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const connectDB = require('./config/db.cjs');

// Load environment variables (supports local Server/.env or global environment variables)
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else {
  require("dotenv").config();
}

// Firebase admin initialization
if (process.env.FIREBASE_PRIVATE_KEY) {
  try {
    require('./config/firebaseAdmin.cjs');
  } catch (err) {
    console.error("⚠️ Firebase Admin initialization warning:", err.message);
  }
}

// Routes
const profileRoutes = require('./routes/profile_routes.cjs');
const authRoutes = require('./routes/authroutes.cjs');
const orderRoutes = require('./routes/order_routes.cjs');
const paymentRoutes = require('./routes/paymentRoutes.cjs');
const otpRoutes = require('./routes/otpRoutes.cjs');
const menuRoutes = require('./routes/menuRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);

// OTP Routes
app.use('/', otpRoutes);

// Serve Invoice Files (support local and temporary serverless storage)
const localInvoicesDir = path.join(__dirname, 'invoices');
const tmpInvoicesDir = path.join(os.tmpdir(), 'invoices');
app.use('/invoices', express.static(localInvoicesDir));
app.use('/invoices', express.static(tmpInvoicesDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
