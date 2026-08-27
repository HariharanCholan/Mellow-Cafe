const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    default: null,
  },

  password: {
    type: String,
    default: null,
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  picture: String,

  role: {
    type: String,
    enum: ["user", "worker", "staff", "admin", "super_admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);