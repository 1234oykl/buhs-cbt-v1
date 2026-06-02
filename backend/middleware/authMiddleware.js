const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("=================================");
    console.log("🔥 AUTH MIDDLEWARE HIT");
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN RECEIVED:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    console.log("USER FOUND:", user ? user._id : "NULL");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      className: user.className,
      admissionNo: user.admissionNo,
    };

    console.log("========== AUTH ==========");
    console.log("AUTH SUCCESS");
    console.log("REQ.USER SET:", req.user);

    return next();
  } catch (err) {
    console.log("=================================");
    console.log("❌ AUTH ERROR");
    console.log(err);
    console.log("=================================");

    return res.status(401).json({
      message: "Token failed or expired",
    });
  }
};

module.exports = auth;