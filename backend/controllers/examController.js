const asyncHandler = require("express-async-handler");
const Exam = require("../models/examModel");

// =========================
// CREATE EXAM
// =========================
const createExam = asyncHandler(async (req, res) => {
  const { title, className, subject, duration, questions } = req.body;

  // validation
  if (!title || !className || !subject || !duration) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    res.status(400);
    throw new Error("Questions are required");
  }

  const existing = await Exam.findOne({ title });

  if (existing) {
    res.status(400);
    throw new Error("Exam already exists");
  }

  const exam = await Exam.create({
    title,
    className,
    subject,
    duration,
    questions,
  });

  res.status(201).json(exam);
});

// =========================
// GET ALL EXAMS
// =========================
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find();
  res.json(exams);
});

// =========================
// GET EXAMS BY CLASS
// =========================
const getExamsByClass = asyncHandler(async (req, res) => {
  const exams = await Exam.find({
    className: req.params.className,
  });

  res.json(exams);
});

// =========================
// GET SINGLE EXAM
// =========================
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.json(exam);
});

const startExam = asyncHandler(async (req, res) => {
  const { examId } = req.body;

  const exam = await Exam.findById(examId);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  // shuffle questions
  const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);

  res.json({
    exam,
    shuffledQuestions,
  });
});

module.exports = {
  createExam,
  getExams,
  getExamById,
  getExamsByClass,
  startExam,
};
