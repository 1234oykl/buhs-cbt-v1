const express = require("express");
const router = express.Router();

const {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
} = require("../controllers/resultController");

const auth = require("../middleware/authMiddleware");

// 🔥 TEST ROUTE (safe)
router.post("/submit", auth, submitExam);

router.get("/", auth, getResults);
router.get("/leaderboard/:examId", auth, getLeaderboard);
router.get("/student/:id", auth, getStudentResults);

module.exports = router;