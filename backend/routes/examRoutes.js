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
// HEALTH CHECK (VERY IMPORTANT)
// ========================
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Exam routes working" });
});


// ========================
// GET ALL EXAMS (STUDENT DASHBOARD)
// ========================
router.get("/", auth, (req, res, next) => {
  try {
    return getExams(req, res, next);
  } catch (err) {
    console.error("GET EXAMS ERROR:", err);
    return res.status(500).json({ message: "Failed to load exams" });
  }
});


// ========================
// GET EXAMS BY CLASS
// ========================
router.get("/class/:className", auth, (req, res, next) => {
  try {
    return getExamsByClass(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load class exams" });
  }
});


// ========================
// GET SINGLE EXAM
// ========================
router.get("/:id", auth, (req, res, next) => {
  try {
    return getExamById(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "Exam not found" });
  }
});


// ========================
// START EXAM
// ========================
router.post("/start", auth, (req, res, next) => {
  try {
    return startExam(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "Failed to start exam" });
  }
});


// ========================
// CREATE EXAM (ADMIN ONLY)
// ========================
router.post("/", auth, adminOnly, (req, res, next) => {
  try {
    return createExam(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create exam" });
  }
});

module.exports = router;