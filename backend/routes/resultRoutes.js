const express = require("express");
const router = express.Router();

const {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
} = require("../controllers/resultController");

const auth = require("../middleware/authMiddleware");

router.post("/submit", auth, submitExam);
router.get("/", auth, getResults);
router.get("/leaderboard/:examId", auth, getLeaderboard);
router.get("/student/:id", auth, getStudentResults);
router.post("/submit", auth, (req, res) => {
  console.log("HEADERS:", req.headers);
  res.send("ok");
});

module.exports = router;
