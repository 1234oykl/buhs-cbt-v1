const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    console.log("MONGO URI EXISTS:", !!MONGO_URI);

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB ERROR:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;