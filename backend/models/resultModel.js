const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: {
      type: Array,
      default: [],
    },

    shuffledQuestions: {
      type: Array,
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

module.exports = mongoose.model("Result", resultSchema);
