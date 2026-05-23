const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate subjects in same class
subjectSchema.index({ name: 1, className: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);