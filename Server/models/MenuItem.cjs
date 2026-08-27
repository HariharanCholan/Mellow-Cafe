const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  itemId: { type: Number, required: true, unique: true }, // original numeric ID (1-98)
  categoryId: { type: String, required: true },           // e.g. "hot-cold"
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  size: { type: String, default: null },                  // e.g. "1/2 Kg", "1 Kg"
  options: { type: [String], default: [] },               // flavor options e.g. ["Vanilla","Mango"]
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
