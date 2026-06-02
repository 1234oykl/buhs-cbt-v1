const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  registerUser,
  loginUser,
  getMe,
  adminLogin,
  getAllUsers,
  createAdmin
} = require("../controllers/userController");


// ✅ USER AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ ADMIN LOGIN ROUTE (this is what your frontend should call)
router.post("/admin/login", adminLogin);

router.post("/admin/register", createAdmin);

// ✅ PROFILE
router.get("/me", protect, getMe);

// ✅ ADMIN ONLY ROUTES
router.get("/all", protect, adminOnly, getAllUsers);


// ⚠️ TEMP SETUP ROUTE (only for development)
router.post("/setup-admin", async (req, res) => {
  const User = require("../models/userModel");
  const bcrypt = require("bcryptjs");

  try {
    const existing = await User.findOne({ email: "admin@buhs.com" });

    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "BUHS Admin",
      email: "admin@buhs.com",
      password: hashedPassword,
      isAdmin: true,
    });

    res.json({ message: "Admin created", admin });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

module.exports = router;