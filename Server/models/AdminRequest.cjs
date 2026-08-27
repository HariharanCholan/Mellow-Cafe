const mongoose = require("mongoose");

const adminRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "revoked"],
      default: "pending",
    },
    assignedRole: {
      type: String,
      enum: ["worker", "staff", "admin", "super_admin", null],
      default: null,
    },
    isPasswordSet: {
      type: Boolean,
      default: false,
    },
    setupCompletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminRequest", adminRequestSchema);
