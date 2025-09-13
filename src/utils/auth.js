import jwt from "jsonwebtoken";

export default function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { valid: false, message: "No token provided" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, message: "Invalid token" };
  }
}
