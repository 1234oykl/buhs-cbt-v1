const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: String,
  className: String, // SS1, SS2, SS3 only
  subject: String,
  duration: Number,
  date: Date,

  examCode: {
    type: String,
    default: () => `EX-${Date.now()}`
  },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],

  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });
module.exports = mongoose.model("Exam", examSchema);