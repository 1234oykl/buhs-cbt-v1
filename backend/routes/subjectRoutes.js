const express = require("express");
const router = express.Router();

const {
  createSubject,
  getSubjectsByClass,
  getSubjects,
} = require("../controllers/subjectController");

const auth = require("../middleware/authMiddleware");

// admin check middleware (simple)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

// GET all subjects
router.get("/", auth, getSubjects);

// GET subjects by class
router.get("/class/:className", auth, getSubjectsByClass);

// CREATE subject (admin only)
router.post("/", auth, adminOnly, createSubject);

module.exports = router;