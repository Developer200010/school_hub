import { createConnection } from '@/utils/db';

export default async function GET(req,res) {
  try {
    // Get query params from URL
    const { id } = req.query;
    
    if (!id) {
      return res.json({ error: "Missing school id" }, { status: 400 });
    }

    const db = await createConnection();
    const [rows] = await db.query("SELECT * FROM schools WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.json({ message: "School not found" }, { status: 404 });
    }

    return res.json({ message: "School found successfully", result: rows[0] });
  } catch (error) {
    console.error("Error fetching school:", error);
    return res.json({ error: error.message }, { status: 500 });
  }
}
