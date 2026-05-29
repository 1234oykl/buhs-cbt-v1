const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require("cors");
const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const resultRoutes = require("./routes/resultRoutes");
const examRoutes = require("./routes/examRoutes");
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
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true
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

// ERROR HANDLER (LAST)
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`.cyan.underline
  );
});