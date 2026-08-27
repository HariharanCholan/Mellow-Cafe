/**
 * seedMenu.cjs
 * One-off script: seeds the MenuItem and Category collections in MongoDB
 * from the client-side menu.js data file.
 *
 * Usage (from repo root):
 *   node Server/scripts/seedMenu.cjs
 *
 * Requires MONGODB_URI in Server/.env (or root .env)
 */

const path    = require('path');
const fs      = require('fs');
const mongoose = require('mongoose');

// Load .env from Server/ directory first, fallback to root
const serverEnv = path.resolve(__dirname, '..', '.env');
const rootEnv   = path.resolve(__dirname, '..', '..', '.env');
if (fs.existsSync(serverEnv)) {
  require('dotenv').config({ path: serverEnv });
} else {
  require('dotenv').config({ path: rootEnv });
}

const Category = require('../models/Category.cjs');
const MenuItem  = require('../models/MenuItem.cjs');

// ──────────────────────────────────────────────────────────────────────────────
// Inline menu data (copied from Client/src/data/menu.js to avoid ESM import issues)
// ──────────────────────────────────────────────────────────────────────────────
const categories = [
  { id: 'hot-cold',      name: 'Hot & Cold Beverages' },
  { id: 'starters',      name: 'Starters' },
  { id: 'sandwiches',    name: 'Sandwiches' },
  { id: 'pizzas',        name: 'Pizzas' },
  { id: 'cakes',         name: 'Cakes' },
  { id: 'pies',          name: 'Pies' },
  { id: 'pastries',      name: 'Pastries' },
  { id: 'snacks',        name: 'Snacks' },
  { id: 'cakes-brownies', name: 'Cakes & Brownies' },
  { id: 'dry-cakes',     name: 'Dry Cakes' },
];

// Items keyed by categoryId — extend/edit this list to match your actual menu.js
// Format: { itemId, name, price, stock, size?, options? }
const itemsByCat = {
  'hot-cold': [
    { itemId: 1, name: 'Filter Coffee',     price: 40,  stock: 100 },
    { itemId: 2, name: 'Cappuccino',        price: 80,  stock: 100 },
    { itemId: 3, name: 'Latte',             price: 90,  stock: 100 },
    { itemId: 4, name: 'Cold Coffee',       price: 80,  stock: 100 },
    { itemId: 5, name: 'Masala Chai',       price: 30,  stock: 100 },
    { itemId: 6, name: 'Lemon Ice Tea',     price: 60,  stock: 100 },
    { itemId: 7, name: 'Mango Milkshake',   price: 100, stock: 100 },
    { itemId: 8, name: 'Strawberry Shake',  price: 100, stock: 100 },
  ],
  'starters': [
    { itemId: 10, name: 'French Fries',     price: 80,  stock: 60 },
    { itemId: 11, name: 'Chicken Nuggets',  price: 130, stock: 60 },
    { itemId: 12, name: 'Veg Nuggets',      price: 110, stock: 60 },
    { itemId: 13, name: 'Spring Rolls',     price: 90,  stock: 60 },
    { itemId: 14, name: 'Garlic Bread',     price: 70,  stock: 60 },
  ],
  'sandwiches': [
    { itemId: 20, name: 'Classic Club',     price: 120, stock: 50 },
    { itemId: 21, name: 'Chicken Mayo',     price: 130, stock: 50 },
    { itemId: 22, name: 'Veg Grilled',      price: 100, stock: 50 },
    { itemId: 23, name: 'BLT',             price: 140, stock: 50 },
  ],
  'pizzas': [
    { itemId: 30, name: 'Margherita',       price: 180, stock: 40 },
    { itemId: 31, name: 'Chicken BBQ',      price: 220, stock: 40 },
    { itemId: 32, name: 'Veg Supreme',      price: 200, stock: 40 },
    { itemId: 33, name: 'Pepperoni',        price: 250, stock: 40 },
  ],
  'cakes': [
    { itemId: 40, name: 'Chocolate Cake',   price: 350, stock: 20, size: '1/2 Kg' },
    { itemId: 41, name: 'Chocolate Cake',   price: 650, stock: 20, size: '1 Kg' },
    { itemId: 42, name: 'Vanilla Cake',     price: 320, stock: 20, size: '1/2 Kg' },
    { itemId: 43, name: 'Vanilla Cake',     price: 600, stock: 20, size: '1 Kg' },
    { itemId: 44, name: 'Red Velvet',       price: 400, stock: 20, size: '1/2 Kg' },
    { itemId: 45, name: 'Red Velvet',       price: 750, stock: 20, size: '1 Kg' },
  ],
  'pies': [
    { itemId: 50, name: 'Apple Pie',        price: 120, stock: 30 },
    { itemId: 51, name: 'Chocolate Pie',    price: 130, stock: 30 },
    { itemId: 52, name: 'Lemon Meringue',   price: 140, stock: 30 },
  ],
  'pastries': [
    { itemId: 60, name: 'Croissant',        price: 60,  stock: 40 },
    { itemId: 61, name: 'Danish Pastry',    price: 70,  stock: 40 },
    { itemId: 62, name: 'Eclair',           price: 80,  stock: 40 },
    { itemId: 63, name: 'Muffin',           price: 60,  stock: 40, options: ['Chocolate', 'Blueberry', 'Banana'] },
  ],
  'snacks': [
    { itemId: 70, name: 'Puff Pastry',      price: 30,  stock: 80 },
    { itemId: 71, name: 'Kachori',          price: 25,  stock: 80 },
    { itemId: 72, name: 'Samosa',           price: 20,  stock: 80 },
    { itemId: 73, name: 'Veg Roll',         price: 60,  stock: 80 },
    { itemId: 74, name: 'Chicken Roll',     price: 80,  stock: 80 },
  ],
  'cakes-brownies': [
    { itemId: 80, name: 'Chocolate Brownie', price: 60, stock: 60 },
    { itemId: 81, name: 'Walnut Brownie',    price: 70, stock: 60 },
    { itemId: 82, name: 'Mini Cupcake',      price: 50, stock: 60, options: ['Vanilla', 'Chocolate', 'Strawberry'] },
  ],
  'dry-cakes': [
    { itemId: 90, name: 'Plum Cake',         price: 200, stock: 30 },
    { itemId: 91, name: 'Almond Cake',       price: 220, stock: 30 },
    { itemId: 92, name: 'Fruit Cake',        price: 210, stock: 30 },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
async function connect() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/mellowcafe';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
}

async function seedCategories() {
  const docs = categories.map((c) => ({
    id:   c.id,
    name: c.name,
  }));
  await Category.deleteMany({});
  await Category.insertMany(docs);
  console.log(`🌱 Seeded ${docs.length} categories`);
}

async function seedMenuItems() {
  const docs = [];
  for (const [categoryId, items] of Object.entries(itemsByCat)) {
    for (const item of items) {
      docs.push({
        itemId:     item.itemId,
        categoryId,
        name:       item.name,
        price:      item.price,
        stock:      item.stock ?? 50,
        size:       item.size  ?? null,
        options:    item.options ?? [],
      });
    }
  }
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(docs);
  console.log(`🍽️  Seeded ${docs.length} menu items`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await connect();
    await seedCategories();
    await seedMenuItems();
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❗ Seeding failed:', err);
    process.exit(1);
  }
})();
