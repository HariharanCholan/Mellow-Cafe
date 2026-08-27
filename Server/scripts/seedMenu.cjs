// seedMenu.cjs
// One-off script to seed the menu data into MongoDB.
// This script is intentionally excluded from version control (added to .gitignore).

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables (e.g., MONGODB_URI) if using dotenv
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Import Mongoose models
const Category = require('../models/Category.cjs');
const MenuItem = require('../models/MenuItem.cjs');

// Import the menu data (the same structure used on the client)
const { menuData } = require('../../Client/src/data/menu.js');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mellowcafe';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB');
}

async function seedCategories() {
  const categories = menuData.categories.map((cat) => ({
    _id: cat.id,
    name: cat.name,
    description: cat.description,
    image: cat.image,
  }));
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log(`🌱 Inserted ${categories.length} categories`);
}

async function seedMenuItems() {
  const items = [];
  for (const [categoryId, products] of Object.entries(menuData.items)) {
    for (const product of products) {
      items.push({
        _id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: categoryId,
        options: product.options || [],
      });
    }
  }
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(items);
  console.log(`🍽️ Inserted ${items.length} menu items`);
}

(async () => {
  try {
    await connectDB();
    await seedCategories();
    await seedMenuItems();
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❗ Seeding failed:', err);
    process.exit(1);
  }
})();
