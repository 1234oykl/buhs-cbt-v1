const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require("cors");
const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "8.8.8.8"]);



const resultRoutes = require("./routes/resultRoutes");
console.log("🔥🔥🔥 RESULT ROUTES LOADED V2 🔥🔥🔥");
const examRoutes = require("./routes/examRoutes");
console.log("🔥 EXAM ROUTES LOADED V2:", typeof examRoutes);
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;

// CONNECT DB
connectDB();

// DB connection log
mongoose.connection.once("open", () => {
  console.log("CONNECTED DB:", mongoose.connection.name);
});

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===============================
// ✅ PRODUCTION CORS FIX
// ===============================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://buhs-cbt-v1.vercel.app" // 👈 CHANGE THIS TO YOUR REAL VERCEL URL
];

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ROUTES
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to BUHS CBT API"
  });
});

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);

app.get("/test-result-save", async (req, res) => {
  const Result = require("./models/resultModel");

  try {
    const test = await Result.create({
      student: "665000000000000000000000",
      exam: "665000000000000000000000",
      score: 5,
      total: 10,
      answers: []
    });

    res.json({
      message: "SAVE WORKS",
      data: test
    });

  } catch (err) {
    console.log("TEST SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/test-server", (req, res) => {
  res.json({
    message: "NEW SERVER FILE IS RUNNING"
  });
});


app.post("/debug-submit", (req, res) => {
  console.log("🔥 DEBUG ROUTE HIT");
  res.json({ ok: true });
});


app.post("/api/test-hit", (req, res) => {
  console.log("🔥 HIT CONFIRMED");
  res.json({ ok: true });
});


// ERROR HANDLER (LAST)
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`.cyan.underline
  );
});