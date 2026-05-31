const Exam = require("../models/examModel");
const Attempt = require("../models/attemptModel"); // NEW MODEL

const startExam = async (req, res) => {
  const { examId } = req.body;

  const exam = await Exam.findById(examId);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  let attempt = await Attempt.findOne({
    student: req.user._id,
    exam: examId,
  });

  // BLOCK COMPLETED
  if (attempt && attempt.status === "completed") {
    return res.status(403).json({
      message: "You have already taken this exam",
    });
  }

  // REUSE IN-PROGRESS
  if (attempt && attempt.status === "in-progress") {
    return res.json({
      attemptId: attempt._id,
      shuffledQuestions: attempt.shuffledQuestions,
      status: attempt.status,
    });
  }

  // CREATE NEW ATTEMPT
  const shuffled = exam.questions
    .map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      marks: q.marks || 1,
    }))
    .sort(() => Math.random() - 0.5);

  attempt = await Attempt.create({
    student: req.user._id,
    exam: examId,
    shuffledQuestions: shuffled,
    answers: [],
    status: "in-progress",
    startedAt: new Date(),
  });

  res.json({
    attemptId: attempt._id,
    examId: exam._id,
    title: exam.title,
    duration: exam.duration,
    shuffledQuestions: shuffled,
  });
};