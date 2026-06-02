const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("=================================");
    console.log("🔥 AUTH MIDDLEWARE HIT");
    console.log("AUTH HEADER:", authHeader);

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    console.log("TOKEN RECEIVED:", token);

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED TOKEN:", decoded);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // Find user
    const user = await User.findById(decoded.id)
      .select("-password");

    console.log(
      "USER FOUND:",
      user ? user._id : "NULL"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    console.log("REQ.USER SET:", req.user);
    console.log("=================================");

    next();
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