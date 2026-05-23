const Exam = require("../models/examModel");
const Result = require("../models/resultModel");

const startExam = async (req, res) => {
  const { examId } = req.body;

  const exam = await Exam.findById(examId);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  // check if already started
  let attempt = await Result.findOne({
    student: req.user.id,
    exam: examId,
  });

  if (attempt) {
    return res.json(attempt); // return same shuffled order
  }

  // shuffle questions
  const shuffled = [...exam.questions].sort(
    () => Math.random() - 0.5
  );

  attempt = await Result.create({
    student: req.user.id,
    exam: examId,
    shuffledQuestions: shuffled,
    answers: {},
    status: "in-progress",
  });

  res.json({
    exam,
    shuffledQuestions: shuffled,
    attemptId: attempt._id,
  });
};