import { createConnection } from "@/utils/db";
import { verifyToken } from "../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { valid, message, user } = verifyToken(req, res);
  if (!valid) {
    return res.status(401).json({ error: message });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "School ID is required" });

    const conn = await createConnection();
    const [result] = await conn.query("DELETE FROM schools WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    return res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return res.status(500).json({ error: error.message });
  }
}
