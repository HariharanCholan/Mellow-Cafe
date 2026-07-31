const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userEmail: String,
  items: Array,
  total: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
