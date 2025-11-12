import User from "../model/UserModel.js";
import { verifyToken } from "../utils/jwt.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized access - no token available",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key not configured");
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET_KEY); // Helper function is used here

    const currentUser = await User.findById(decoded.userId).select("-password");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isTeacher = async (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({
      message: "Access denied - Teacher Only",
    });
  }
  next();
};
