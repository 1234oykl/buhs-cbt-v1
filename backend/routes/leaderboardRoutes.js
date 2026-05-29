const express = require("express");
const {getLeaderboard } = require("../controllers/resultController.js");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);

module.exports = router;