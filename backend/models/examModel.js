const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    className: {
      type: String,
      required: true,
    },

    // ✅ ADD SUBJECT
    subject: { type: String, required: true },

    duration: { type: Number, required: true },
    
    examCode: {
      type: String,
      unique: true,
    },

    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },

        // admin only
        correctAnswer: { type: String, required: true },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Exam", examSchema);
