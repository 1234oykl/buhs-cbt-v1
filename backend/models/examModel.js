const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    className: { type: String, required: true, index: true },

    subject: { type: String, required: true },

    duration: { type: Number, required: true },

    date: {
      type: Date,
      required: true,
    },

    examCode: {
      type: String,
      unique: true,
    },

    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
      },
    ],

    examKey: {
      type: String,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Exam", examSchema);
