const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  createExam,
  getExams,
  getExamById,
  getExamsByClass,
  startExam,
} = require("../controllers/examController");


// ========================
// HEALTH CHECK
// ========================
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Exam routes working" });
});


// ========================
// GET ALL EXAMS
// ========================
router.get("/", auth, getExams);


// ========================
// GET EXAMS BY CLASS
// ========================
router.get("/class/:className", auth, getExamsByClass);


// ========================
// GET SINGLE EXAM
// ========================
router.get("/:id", auth, getExamById);


// ========================
// START EXAM
// ========================
router.post("/start", auth, startExam);


// ========================
// CREATE EXAM (ADMIN ONLY)
// ========================
router.post("/", auth, adminOnly, createExam);


module.exports = router;