const express = require("express");
const Category = require("../models/Category.cjs");
const MenuItem = require("../models/MenuItem.cjs");

const router = express.Router();

/* GET /api/menu/categories — all categories sorted by order */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    console.error("Menu categories error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET /api/menu/items/:categoryId — all items for a category */
router.get("/items/:categoryId", async (req, res) => {
  try {
    const items = await MenuItem.find({ categoryId: req.params.categoryId })
      .sort({ itemId: 1 })
      .lean();
    res.json({ items });
  } catch (err) {
    console.error("Menu items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET /api/menu/all — full menu in one call (categories + items map) */
router.get("/all", async (req, res) => {
  try {
    const [categories, allItems] = await Promise.all([
      Category.find({}).sort({ order: 1 }).lean(),
      MenuItem.find({}).sort({ itemId: 1 }).lean(),
    ]);

    // Build items map keyed by categoryId, matching the old menu.js shape
    const items = {};
    for (const item of allItems) {
      if (!items[item.categoryId]) items[item.categoryId] = [];
      items[item.categoryId].push(item);
    }

    res.json({ categories, items });
  } catch (err) {
    console.error("Menu all error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
