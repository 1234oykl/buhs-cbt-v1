const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "admin@buhs.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "BUHS Admin",
      email: "admin@buhs.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit();
  } catch (err) {
    console.log("Seeder error:", err.message);
    process.exit(1);
  }
};

createAdmin();