import formidable from "formidable";
import cloudinary from "cloudinary";
import { createConnection } from "@/utils/db";
import { verifyToken } from "../utils/auth";

export const config = {
  api: { bodyParser: false },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { valid, message, user } = verifyToken(req, res);
  if (!valid) {
    return res.status(401).json({ error: message });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { id } = fields;

    if (!id?.[0]) {
      return res.status(400).json({ error: "School ID is required" });
    }

    let imageUrl = null;
    if (files.image && files.image[0]) {
      const uploadResult = await cloudinary.v2.uploader.upload(files.image[0].filepath, {
        folder: "schoolhub",
      });
      imageUrl = uploadResult.secure_url;
    }

    const conn = await createConnection();
    const [result] = await conn.query(
      `UPDATE schools SET 
        name=?, address=?, city=?, state=?, contact=?, email=?, image=IFNULL(?, image) 
       WHERE id=?`,
      [
        fields.name?.[0] || null,
        fields.address?.[0] || null,
        fields.city?.[0] || null,
        fields.state?.[0] || null,
        fields.contact?.[0] || null,
        fields.email?.[0] || null,
        imageUrl,
        id[0],
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    return res.status(200).json({ message: "School updated successfully" });
  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({ error: error.message });
  }
}
