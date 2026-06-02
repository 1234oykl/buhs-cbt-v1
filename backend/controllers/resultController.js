const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Result = require("../models/resultModel");
const Exam = require("../models/examModel");
const User = require("../models/userModel");

// =========================
// SUBMIT EXAM
// =========================



const submitExam = asyncHandler(async (req, res) => {
  console.log("========== SUBMIT ==========");
  console.log("REQ.USER:", req.user);
  console.log("BODY:", req.body);
  console.log("BODY:", req.body);

  // 1. AUTH CHECK FIRST (MUST BE FIRST)
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Auth failed - user not found",
    });
  }

  const student = req.user.id;
  const { exam, answers } = req.body;

  // 2. VALIDATION

  if (!student) {
    return res.status(401).json({
      message: "Student not found in request",
    });
  }

  if (!exam || !Array.isArray(answers)) {
    return res.status(400).json({
      message: "Exam or answers missing/invalid",
    });
  }

  console.log("STUDENT:", student);
  console.log("EXAM:", exam);

  // 3. CHECK DUPLICATE
  const existing = await Result.findOne({
    student: new mongoose.Types.ObjectId(student),
    exam: new mongoose.Types.ObjectId(exam),
  });

  if (existing) {
    return res.status(400).json({
      message: "You have already taken this exam",
    });
  }

  // 4. GET EXAM
  const examData = await Exam.findById(exam);

  if (!examData) {
    return res.status(404).json({
      message: "Exam not found",
    });
  }

  // 5. SCORING
  let score = 0;
  let wrong = 0;

  const detailedResults = examData.questions.map((q) => {
    const selected = answers.find(
      (a) => String(a.questionId) === String(q._id),
    );

    const isCorrect =
      selected && String(selected.answer) === String(q.correctAnswer);

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

  const totalMarks = examData.questions.reduce(
    (acc, q) => acc + (q.marks || 1),
    0,
  );

  const percentage =
    totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  // 6. SAVE RESULT
  try {
  const result = await Result.create({
    student,
    exam,
    answers: detailedResults,
    score,
    wrong,
    total: totalQuestions,
    percentage,
  });

  console.log("RESULT SAVED:", result._id);

  res.status(201).json({
    message: "Submitted successfully",
    result,
  });
} catch (err) {
  console.log("SAVE ERROR:", err);
  res.status(500).json({
    message: err.message,
  });
}

  console.log("RESULT SAVED:", result._id);

  res.status(201).json({
    message: "Submitted successfully",
    score,
    total: totalQuestions,
    percentage,
    result,
  });
});

// =========================
// GET ALL RESULTS
// =========================
const getResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("student", "name className admissionNo")
    .populate("exam", "title subject");

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
    "title subject",
  );

  res.json(results);
});

module.exports = {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
};
