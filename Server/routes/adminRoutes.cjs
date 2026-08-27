const express = require("express");
const User = require("../models/User.cjs");
const Order = require("../models/Orders.cjs");
const MenuItem = require("../models/MenuItem.cjs");
const AdminRequest = require("../models/AdminRequest.cjs");
const { verifyToken, requireRole } = require("../middleware/auth.cjs");

const router = express.Router();

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

      // Update user's role in the Users collection
      await User.findOneAndUpdate(
        { email: request.email },
        { role },
        { upsert: false }
      );

      res.json({ message: `Request approved. User assigned role: ${role}` });
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
