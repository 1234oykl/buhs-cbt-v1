const asyncHandler = require("express-async-handler");
const Result = require("../models/resultModel");
const Exam = require("../models/examModel");
const User = require("../models/userModel");

const submitExam = asyncHandler(async (req, res) => {
  console.log("🔥 SUBMIT ROUTE HIT");

  const student = req.user._id;
  const { exam, answers } = req.body;

  console.log("STUDENT:", student);
  console.log("EXAM:", exam);

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
    return res.status(404).json({
      message: "Exam not found",
    });
  }

  let score = 0;
  let wrong = 0;

  const detailedResults = examData.questions.map((q) => {
    const selected = answers.find(
      (a) => a.questionId === q._id.toString()
    );

    const isCorrect =
      selected?.answer === q.correctAnswer;

    if (isCorrect) {
      score += q.marks || 1;
    } else {
      wrong++;
    }

    return {
      questionId: q._id,
      question: q.question,
      selected: selected?.answer || null,
      correct: q.correctAnswer,
      isCorrect,
    };
  });

  const total = examData.questions.length;

  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  console.log("ABOUT TO SAVE RESULT");

  const result = await Result.create({
    student,
    exam,
    answers: detailedResults,
    score,
    wrong,
    total,
    percentage,
  });

  console.log("RESULT SAVED:", result._id);

  res.status(200).json({
    message: "Submitted successfully",
    score,
    total,
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
  console.log("RESULTS FOUND:", results.length);

  res.json(results);
});

// =========================
// GET LEADERBOARD
// =========================
const getLeaderboard = asyncHandler(async (req, res) => {
  const results = await Result.find({
    exam: req.params.examId,
  })
    .populate("student", "name className")
    .sort({ score: -1 });

  res.json(results);
});

// =========================
// GET STUDENT RESULTS
// =========================
const getStudentResults = asyncHandler(async (req, res) => {
  const results = await Result.find({
    student: req.params.id,
  }).populate("exam");

  res.json(results);
});

module.exports = {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
};
