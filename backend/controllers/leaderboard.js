const Result = require("../models/resultModel");

// GET leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.find()
      .populate("student", "name className admissionNo")
      .populate("exam", "title")
      .sort({ percentage: -1 });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeaderboard };