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
// CREATE EXAM (ADMIN ONLY)
// ========================
router.post("/", auth, adminOnly, createExam);

// ========================
// GET ALL EXAMS
// ========================
router.get("/", auth, getExams);

// ========================
// GET EXAMS BY CLASS (MUST COME BEFORE :id)
// ========================
router.get("/class/:className", auth, getExamsByClass);

// ========================
// GET SINGLE EXAM
// ========================
router.get("/:id", auth, getExamById);

router.post("/start", auth, startExam);

module.exports = router;