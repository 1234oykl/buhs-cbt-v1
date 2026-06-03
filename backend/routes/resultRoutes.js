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

router.get("/class/:className", auth, async (req, res) => {
  const results = await Result.find()
    .populate("student", "name className admissionNo")
    .populate("exam", "title subject className");

  const filtered = results.filter(
    (r) => r.exam?.className === req.params.className,
  );

  res.json(filtered);
});


router.get("/leaderboard", auth, async (req, res) => {
  console.log("USER:", JSON.parse(localStorage.getItem("user")));
  const results = await Result.find()
    .populate("student", "name className")
    .sort({ score: -1 })
    .limit(10);

  res.json(results);
});


router.get("/analytics/subjects", auth, async (req, res) => {
  const results = await Result.find().populate("exam", "subject");

  const summary = {};

  results.forEach((r) => {
    const subject = r.exam?.subject || "Unknown";

    if (!summary[subject]) {
      summary[subject] = {
        total: 0,
        score: 0,
      };
    }

    summary[subject].total += 1;
    summary[subject].score += r.score;
  });

  const output = Object.keys(summary).map((subj) => ({
    subject: subj,
    average: summary[subj].score / summary[subj].total,
  }));

  res.json(output);
});

module.exports = router;
