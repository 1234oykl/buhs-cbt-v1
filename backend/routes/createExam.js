const express = require("express");
const router = express.Router();
const { createExam } = require("../controllers/examController");

router.post("/", createExam);

module.exports = router;