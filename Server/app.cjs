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

// Models
const User = require('./models/User.cjs');

// Routes
const profileRoutes = require('./routes/profile_routes.cjs');
const authRoutes = require('./routes/authroutes.cjs');
const orderRoutes = require('./routes/order_routes.cjs');
const paymentRoutes = require('./routes/paymentRoutes.cjs');
const otpRoutes = require('./routes/otpRoutes.cjs');

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

// Default admin creator function
let adminCreated = false;
async function createDefaultAdmin() {
  if (adminCreated) return;
  try {
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
    adminCreated = true;
  } catch (err) {
    console.error("Default admin creation check skipped/failed:", err.message);
  }
}

createDefaultAdmin();

module.exports = app;
