import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key not configured");
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key not configured");
  }

  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
