const asyncHandler = require("express-async-handler");
const Subject = require("../models/subjectModel");

// ===============================
// CREATE SUBJECT (Admin)
// POST /api/subjects
// ===============================
const createSubject = asyncHandler(async (req, res) => {
  const { name, className } = req.body;

  if (!name || !className) {
    res.status(400);
    throw new Error("Subject name and className are required");
  }

  const subject = await Subject.create({
    name: name.trim(),
    className: className.trim(),
  });

  res.status(201).json(subject);
});

// ===============================
// GET SUBJECTS FOR CLASS
// GET /api/subjects/class/:className
// ===============================
const getSubjectsByClass = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    className: req.params.className.trim(),
  });

  res.json(subjects);
});

// ===============================
// GET ALL SUBJECTS
// GET /api/subjects
// ===============================
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

module.exports = {
  createSubject,
  getSubjectsByClass,
  getSubjects,
};