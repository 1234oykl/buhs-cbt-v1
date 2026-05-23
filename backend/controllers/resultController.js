const asyncHandler = require("express-async-handler");
const Result = require("../models/resultModel");
const Exam = require("../models/examModel");

// =========================
// SUBMIT EXAM (AUTO SCORE + PREVENT RETAKE)
// =========================
const submitExam = asyncHandler(async (req, res) => {
  const { student, exam, answers } = req.body;

  const examData = await Exam.findById(exam);
  const studentData = await User.findById(student);

  if (examData.className !== studentData.className) {
    return res.status(403).json({ message: "Invalid exam access" });
  }

  let score = 0;
  let total = examData.questions.length;

  const detailedResults = examData.questions.map((q, index) => {
    const isCorrect = answers[index] === q.correctAnswer;

    if (isCorrect) score += q.marks || 1;

    return {
      question: q.question,
      selected: answers[index],
      correct: q.correctAnswer,
      isCorrect,
    };
  });

  const existing = await Result.findOne({
    student: req.body.student,
    exam: req.body.exam,
  });

  if (existing) {
    return res.status(400).json({
      message: "You have already taken this exam",
    });
  }

  const result = await Result.create({
    student,
    exam,
    score,
    total,
    answers: detailedResults,
  });

  res.json({ message: "Submitted", score, total, result });
});

// =========================
// GET ALL RESULTS (ADMIN)
// =========================
const getResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("student", "name className admissionNo")
    .populate("exam", "title duration");

  res.json(results);
});

// =========================
// LEADERBOARD BY EXAM
// =========================
const getLeaderboard = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  const results = await Result.find({ exam: examId })
    .populate("student", "name className")
    .sort({ score: -1 });

  const ranked = results.map((r, index) => {
    const percentage = ((r.score / r.total) * 100).toFixed(1);

    return {
      _id: r._id,
      rank: index + 1,
      student: r.student,
      score: r.score,
      total: r.total,
      percentage,
    };
  });

  res.json(ranked);
});

const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.id }).populate(
      "exam",
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student results" });
  }
};

module.exports = {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
};
