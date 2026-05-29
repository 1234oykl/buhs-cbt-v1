const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const settings = require("../config/adminSettings");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =========================
// REGISTER STUDENT
// =========================
const registerUser = asyncHandler(async (req, res) => {
  const { name, className, admissionNo } = req.body;

  if (!name || !className || !admissionNo) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const userExists = await User.findOne({
      admissionNo: admissionNo.trim(),
    });

    if (userExists) {
      return res.status(400).json({ message: "Admission number already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      className: className.trim(),
      admissionNo: admissionNo.trim(),
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      className: user.className,
      admissionNo: user.admissionNo,
      token: generateToken(user._id),
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Admission number already exists" });
    }

    return res.status(500).json({ message: error.message });
  }
});

// =========================
// STUDENT LOGIN
// =========================
const loginUser = asyncHandler(async (req, res) => {
  const { className, admissionNo } = req.body;

  if (!className || !admissionNo) {
    return res.status(400).json({ message: "Please provide class and admission number" });
  }

  const user = await User.findOne({
    admissionNo: admissionNo.trim(),
    className: className.trim(),
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid login details" });
  }

  res.json({
  _id: user._id,
  name: user.name,
  className: user.className,
  admissionNo: user.admissionNo,
  isAdmin: user.isAdmin,   // ❌ missing before
  token: generateToken(user._id),
});
});

// =========================
// ADMIN LOGIN
// =========================

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN EMAIL:", email);
  console.log("LOGIN PASSWORD:", password);

  if (!settings.adminLoginEnabled) {
  res.status(403);
  throw new Error("Admin access DENIED!");
}

  const admin = await User.findOne({ email, isAdmin: true }).select(
    "+password",
  );

  console.log("ADMIN FOUND:", admin);

  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    isAdmin: true,
    token: generateToken(admin._id),
  });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const adminExists = await User.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const salt = await bcript.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });

  res.status(201).json({
    message: "Admin created successfully",
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    isAdmin: admin.isAdmin,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    className: req.user.className,
    admissionNo: req.user.admissionNo,
    isAdmin: req.user.isAdmin,
  };
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  adminLogin,
  getAllUsers,
  createAdmin,
};
