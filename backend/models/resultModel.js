const mongoose = require("mongoose");

// ANSWER SUB-SCHEMA (IMPORTANT FIX)
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    question: String,
    selected: String,
    correct: String,
    isCorrect: Boolean,
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    className: { type: String },

    subject: { type: String },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    wrong: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// 🔥 PREVENT DUPLICATE EXAM SUBMISSION (VERY IMPORTANT)
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
