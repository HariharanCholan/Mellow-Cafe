const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // slug e.g. "hot-cold"
  name: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  order: { type: Number, default: 0 }, // controls display order
});

module.exports = mongoose.model("Category", categorySchema);
