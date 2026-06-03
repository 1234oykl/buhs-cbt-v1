const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Result = require("../models/resultModel");
const Exam = require("../models/examModel");
const User = require("../models/userModel");

// =========================
// SUBMIT EXAM
// =========================

const submitExam = asyncHandler(async (req, res) => {
  try {
    console.log("========== SUBMIT ==========");
    console.log("🔥 SUBMIT ROUTE HIT");
    console.log("REQ.USER:", req.user);
    console.log("BODY:", req.body);

    const student = req.user?.id || req.user?._id;
    const { exam, answers } = req.body;

    if (!student) {
      return res.status(401).json({ message: "Student not found in request" });
    }

    if (!exam || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "Exam or answers missing/invalid" });
    }

    const existing = await Result.findOne({
      student,
      exam,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already taken this exam",
      });
    }

    const examData = await Exam.findById(exam);

    if (!examData) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    let wrong = 0;

    const detailedResults = examData.questions.map((q) => {
      const selected = answers.find(
        (a) => String(a.questionId) === String(q._id),
      );

      const isCorrect =
        selected &&
        String(selected.answer).trim() === String(q.correctAnswer).trim();

      if (isCorrect) score += q.marks || 1;
      else wrong++;

      return {
        questionId: q._id,
        question: q.question,
        selected: selected?.answer || null,
        correct: q.correctAnswer,
        isCorrect: !!isCorrect,
      };
    });

    const totalQuestions = examData.questions.length;

    const examDoc = await Exam.findById(exam);

    if (!examDoc) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const result = await Result.create({
      student,
      exam,
      examTitle: examDoc.title,
      className: examDoc.className,
      subject: examDoc.subject,
      score,
      wrong,
      total: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
    });
  
    console.log("RESULT SAVED:", result._id);
    x;

    return res.status(201).json({
      message: "Submitted successfully",
      result,
      score,
      total: totalQuestions,
      percentage: result.percentage,
    });
  } catch (err) {
    console.log("SUBMIT ERROR:", err);

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
});

// =========================
// GET ALL RESULTS
// =========================
const getResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("student", "name className admissionNo")
    .populate("exam", "title subject className"); // ✅ ADD className

  console.log("TOTAL RESULTS:", results.length);

  res.json(results);
});

// =========================
// GET LEADERBOARD
// =========================
const getLeaderboard = asyncHandler(async (req, res) => {
  const results = await Result.find({ exam: req.params.examId })
    .populate("student", "name className admissionNo")
    .sort({ score: -1 });

  res.json(results);
});

// =========================
// GET STUDENT RESULTS
// =========================
const getStudentResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ student: req.params.id }).populate(
    "exam",
    "title subject className",
  ); // ✅ ADD className

  res.json(results);
});

module.exports = {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
};
