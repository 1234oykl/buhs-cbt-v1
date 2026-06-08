const asyncHandler = require("express-async-handler");
const Exam = require("../models/examModel");

const createExam = asyncHandler(async (req, res) => {
  console.log("🔥🔥 NEW CREATE EXAM FILE LOADED");
  console.log("🔥 CREATE EXAM CONTROLLER HIT");

  const { title, className, subject, duration, date, questions } = req.body;

  console.log("REQ BODY:", req.body);

  const examCode = `${className}-${subject}-${new Date(date).toISOString().split("T")[0]}`;

  console.log("EXAM CODE:", examCode);

  const existingExam = await Exam.findOne({ examCode });

  if (existingExam) {
    return res.status(400).json({ message: "Exam already exists" });
  }

  // ✅ THIS IS WHAT YOU WERE MISSING
  const exam = await Exam.create({
  title,
  className,
  subject,
  duration,
  date,
  questions,
  examCode,
});

  console.log("🔥 SAVED EXAM:", exam);

  return res.status(201).json({
    message: "Exam created successfully",
    exam,
  });
});

// GET ALL EXAMS
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find();
  console.log("🔥 ALL EXAMS:", exams);
  return res.status(200).json(exams);
});

// GET BY CLASS
const getExamsByClass = asyncHandler(async (req, res) => {
  const exams = await Exam.find({
    className: req.params.className,
    isActive: true,
  });

  return res.status(200).json(exams);
});

// GET SINGLE EXAM
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  return res.status(200).json(exam);
});

const getExamsForStudent = asyncHandler(async (req, res) => {
  const { classLevel } = req.params;

  const exams = await Exam.find({
    className: classLevel,
    isActive: true,
  });

  res.status(200).json(exams);
});

// START EXAM
const startExam = asyncHandler(async (req, res) => {
  const { examId } = req.body;

  const exam = await Exam.findById(examId);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const shuffledQuestions = exam.questions
    .map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      marks: q.marks || 1,
    }))
    .sort(() => Math.random() - 0.5);

  return res.json({
    examId: exam._id,
    title: exam.title,
    className: exam.className,
    subject: exam.subject,
    duration: exam.duration,
    questions: shuffledQuestions,
  });
});

module.exports = {
  createExam,
  getExams,
  getExamById,
  getExamsByClass,
  getExamsForStudent, // ✅ MISSING
  startExam,
};
