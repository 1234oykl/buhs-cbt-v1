const express = require("express");
const router = express.Router();

const Result = require("../models/resultModel"); // ✅ FIX 1 (IMPORTANT)

console.log("RESULT MODEL:", typeof Result);

const {
  submitExam,
  getResults,
  getLeaderboard,
  getStudentResults,
} = require("../controllers/resultController");

const auth = require("../middleware/authMiddleware");

// ==============================
// SUBMIT EXAM
// ==============================
router.post("/submit", auth, submitExam);

// ==============================
// GET ALL RESULTS (ADMIN DASHBOARD)
// ==============================
router.get("/", auth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name className admissionNo")
      .populate("exam", "title subject className");

    res.json(results);
  } catch (err) {
    console.log("GET RESULTS ERROR:", err.message);
    res.status(500).json({ message: "Server error fetching results" });
  }
});

// ==============================
// STUDENT RESULTS
// ==============================
router.get("/student/:id", auth, async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.id }).populate(
      "exam",
      "title subject className",
    );

    res.json(results);
  } catch (err) {
    console.log("STUDENT RESULTS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// CLASS FILTER RESULTS
// ==============================
router.get("/class/:className", auth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name className admissionNo")
      .populate("exam", "title subject className");

    const filtered = results.filter(
      (r) => r.exam?.className === req.params.className,
    );

    res.json(filtered);
  } catch (err) {
    console.log("CLASS FILTER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// LEADERBOARD (TOP 10 STUDENTS)
// ==============================
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name className admissionNo")
      .sort({ score: -1 })
      .limit(10);

    res.json(results);
  } catch (err) {
    console.log("LEADERBOARD ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// LEADERBOARD BY EXAM (OPTIONAL)
// ==============================
router.get("/leaderboard/:examId", auth, async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate("student", "name className admissionNo")
      .sort({ score: -1 })
      .limit(10);

    res.json(results);
  } catch (err) {
    console.log("EXAM LEADERBOARD ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// ANALYTICS (SUBJECT PERFORMANCE)
// ==============================
router.get("/analytics/subjects", auth, async (req, res) => {
  try {
    const results = await Result.find().populate("exam", "subject");

    const summary = {};

    results.forEach((r) => {
      const subject = r.subject || r.exam?.subject || "Unknown";

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
  } catch (err) {
    console.log("ANALYTICS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/class-sheet/:className", auth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name className admissionNo")
      .populate("exam", "title subject className");

    const filtered = results.filter(
      (r) => r.student?.className === req.params.className
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;
