const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  picture: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoogleUser', GoogleUserSchema);
