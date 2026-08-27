const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");
const Order = require("../models/Orders.cjs");
const MenuItem = require("../models/MenuItem.cjs");
const AdminRequest = require("../models/AdminRequest.cjs");
const { verifyToken, requireRole } = require("../middleware/auth.cjs");
const sendEmail = require("../utils/mailer.cjs");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ─── PUBLIC ─────────────────────────────────────────────────────────────── */

/**
 * POST /api/admin/request
 * Anyone can submit an admin access request (no token required)
 */
router.post("/request", async (req, res) => {
  try {
    const { name, email, reason } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Prevent duplicate pending requests from the same email
    const existing = await AdminRequest.findOne({ email, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "You already have a pending request." });
    }

    const request = await AdminRequest.create({ name, email, reason: reason || "" });
    res.status(201).json({ message: "Request submitted successfully", request });
  } catch (err) {
    console.error("Admin request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/admin/verify-setup-token?token=...
 * Validates the invite/setup token before showing the password setup form
 */
router.get("/verify-setup-token", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "admin_setup") {
      return res.status(400).json({ message: "Invalid setup token" });
    }

    res.json({
      valid: true,
      email: decoded.email,
      name: decoded.name || "",
      role: decoded.role,
    });
  } catch (err) {
    console.error("Verify setup token error:", err.message);
    res.status(400).json({ message: "Setup link is invalid or has expired." });
  }
});

/**
 * POST /api/admin/setup-password
 * Allows the approved admin/staff member to set their password and log in
 */
router.post("/setup-password", async (req, res) => {
  try {
    const { token, password, otpToken, otp } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Verify setup token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "admin_setup") {
      return res.status(400).json({ message: "Invalid setup token" });
    }

    // Optional OTP verification if otp & otpToken were provided
    if (otp && otpToken) {
      try {
        const otpDecoded = jwt.verify(otpToken, JWT_SECRET);
        if (otpDecoded.otp !== otp || otpDecoded.email !== decoded.email) {
          return res.status(400).json({ message: "Invalid or mismatched OTP" });
        }
      } catch (e) {
        return res.status(400).json({ message: "OTP expired or invalid" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert the user with the new role and password
    let user = await User.findOne({ email: decoded.email });
    if (user) {
      user.password = hashedPassword;
      user.role = decoded.role;
      user.provider = "local";
      if (!user.name && decoded.name) user.name = decoded.name;
      await user.save();
    } else {
      user = await User.create({
        name: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        password: hashedPassword,
        role: decoded.role,
        provider: "local",
      });
    }

    // Sign login JWT token
    const loginPayload = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.picture || null,
    };
    const loginToken = jwt.sign(loginPayload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Password set successfully! Logging in...",
      token: loginToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture || null,
      },
    });
  } catch (err) {
    console.error("Setup password error:", err);
    res.status(500).json({ message: err.message || "Failed to setup password" });
  }
});

/* ─── PROTECTED ──────────────────────────────────────────────────────────── */

/**
 * GET /api/admin/requests
 * Super Admin only — list all access requests
 */
router.get(
  "/requests",
  verifyToken,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const requests = await AdminRequest.find({}).sort({ createdAt: -1 }).lean();
      res.json({ requests });
    } catch (err) {
      console.error("Get requests error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /api/admin/requests/:id/approve
 * Super Admin only — approve a request and assign a role to the user
 */
router.post(
  "/requests/:id/approve",
  verifyToken,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const { role } = req.body;
      const validRoles = ["worker", "staff", "admin", "super_admin"];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const request = await AdminRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ message: "Request not found" });

      // Update request status
      request.status = "approved";
      request.assignedRole = role;
      await request.save();

      // Update user's role in the Users collection if user exists
      await User.findOneAndUpdate(
        { email: request.email },
        { role },
        { upsert: false }
      );

      // Generate a setup token valid for 7 days
      const setupToken = jwt.sign(
        {
          email: request.email,
          name: request.name,
          role,
          requestId: request._id,
          type: "admin_setup",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const setupLink = `${clientUrl}/admin/setup-password?token=${setupToken}`;

      // Send invite / setup email
      try {
        await sendEmail({
          to: request.email,
          subject: "🎉 Mellow Café — Admin Access Approved! Set Up Your Password ☕",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background: #faf9f7; border: 1px solid #e7e2da; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #92400e; margin: 0; font-size: 24px;">☕ Mellow Café</h1>
                <p style="color: #78716c; margin: 4px 0 0 0; font-size: 14px;">Staff & Admin Portal</p>
              </div>
              <div style="background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e7e2da;">
                <h2 style="color: #1c1917; font-size: 18px; margin-top: 0;">Hello ${request.name},</h2>
                <p style="color: #44403c; line-height: 1.6; font-size: 14px;">
                  Great news! Your request for admin access at <strong>Mellow Café</strong> has been <strong>approved</strong>.
                </p>
                <div style="background: #fef3c7; border-left: 4px solid #92400e; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">
                    Assigned Role: <span style="text-transform: uppercase;">${role}</span>
                  </p>
                </div>
                <p style="color: #44403c; line-height: 1.6; font-size: 14px;">
                  To access your portal, please click the button below to verify your email and set up your password:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${setupLink}" style="background: #92400e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                    Set Up Your Password &rarr;
                  </a>
                </div>
                <p style="color: #78716c; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
                  Or copy and paste this link in your browser:<br />
                  <a href="${setupLink}" style="color: #92400e; word-break: break-all;">${setupLink}</a>
                </p>
              </div>
              <p style="text-align: center; color: #a8a29e; font-size: 12px; margin-top: 20px;">
                This link will expire in 7 days. If you did not request access, you can safely ignore this email.
              </p>
            </div>
          `,
          text: `Hello ${request.name},\n\nYour request for admin access at Mellow Café has been approved with the role: ${role}.\n\nPlease set up your password here: ${setupLink}\n\nThank you,\nMellow Café Team`,
        });
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
      }

      res.json({ message: `Request approved and setup email sent. User assigned role: ${role}` });
    } catch (err) {
      console.error("Approve request error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /api/admin/requests/:id/reject
 * Super Admin only — reject a request
 */
router.post(
  "/requests/:id/reject",
  verifyToken,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const request = await AdminRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ message: "Request not found" });

      request.status = "rejected";
      await request.save();

      res.json({ message: "Request rejected" });
    } catch (err) {
      console.error("Reject request error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET /api/admin/stats
 * Admin/Super Admin — analytics data for the dashboard
 */
router.get(
  "/stats",
  verifyToken,
  requireRole("admin", "super_admin"),
  async (req, res) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalOrders, totalRevenue, todayOrders, weekOrders, monthOrders, allOrders] =
        await Promise.all([
          Order.countDocuments(),
          Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
          Order.countDocuments({ timestamp: { $gte: startOfToday } }),
          Order.countDocuments({ timestamp: { $gte: startOfWeek } }),
          Order.countDocuments({ timestamp: { $gte: startOfMonth } }),
          Order.find({}, { timestamp: 1, total: 1, items: 1 }).lean(),
        ]);

      // Peak hours: count orders per hour of day
      const hourCounts = Array(24).fill(0);
      for (const order of allOrders) {
        const hour = new Date(order.timestamp).getHours();
        hourCounts[hour]++;
      }

      // Top selling items: flatten all items arrays and count
      const itemCount = {};
      for (const order of allOrders) {
        for (const item of order.items || []) {
          const key = item.name || item.id;
          if (!key) continue;
          itemCount[key] = (itemCount[key] || 0) + (item.quantity || 1);
        }
      }
      const topItems = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // Revenue per day for the last 30 days
      const revenueByDay = {};
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      for (const order of allOrders) {
        if (new Date(order.timestamp) < thirtyDaysAgo) continue;
        const day = new Date(order.timestamp).toISOString().split("T")[0];
        revenueByDay[day] = (revenueByDay[day] || 0) + (order.total || 0);
      }

      res.json({
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        weekOrders,
        monthOrders,
        peakHours: hourCounts,
        topItems,
        revenueByDay,
      });
    } catch (err) {
      console.error("Stats error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET /api/admin/menu
 * Staff/Admin/Super Admin — get all menu items for the dashboard table
 */
router.get(
  "/menu",
  verifyToken,
  requireRole("worker", "staff", "admin", "super_admin"),
  async (req, res) => {
    try {
      const items = await MenuItem.find({}).sort({ categoryId: 1, itemId: 1 }).lean();
      res.json({ items });
    } catch (err) {
      console.error("Admin menu error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * PUT /api/admin/menu/:itemId
 * Admin/Super Admin — update stock and/or price for a single item
 */
router.put(
  "/menu/:itemId",
  verifyToken,
  requireRole("admin", "super_admin"),
  async (req, res) => {
    try {
      const { stock, price } = req.body;
      const update = {};
      if (stock !== undefined) update.stock = Number(stock);
      if (price !== undefined) update.price = Number(price);

      if (Object.keys(update).length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      const item = await MenuItem.findOneAndUpdate(
        { itemId: Number(req.params.itemId) },
        update,
        { new: true }
      );

      if (!item) return res.status(404).json({ message: "Item not found" });

      res.json({ message: "Item updated", item });
    } catch (err) {
      console.error("Update menu item error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET /api/admin/orders
 * Staff/Admin/Super Admin — paginated list of all customer orders
 */
router.get(
  "/orders",
  verifyToken,
  requireRole("staff", "admin", "super_admin"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
        Order.countDocuments(),
      ]);

      res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
      console.error("Admin orders error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
