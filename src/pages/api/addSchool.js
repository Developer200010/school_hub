// pages/api/addSchool.js
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ✅ Check if user is verified
  const { valid, message, user } = verifyToken(req, res);
  if (!valid) {
    return res.status(401).json({ error: message });
  }

  try {
    const { fields, files } = await parseForm(req);

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageFile = files.image[0];
    const filePath = imageFile.filepath;

    // Upload file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "schoolhub",
    });

    // Save to DB (✅ also store user id as creator)
    const conn = await createConnection();
    const [dbResult] = await conn.query(
      `INSERT INTO schools (name, address, city, state, contact, email, image, creator_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fields.name?.[0] || "",
        fields.address?.[0] || "",
        fields.city?.[0] || "",
        fields.state?.[0] || "",
        fields.contact?.[0] || "",
        fields.email?.[0] || "",
        result.secure_url,
        user.id, // ✅ from token payload
      ]
    );

    return res.status(200).json({
      message: "School added successfully",
      dbResult,
      data: {
        ...fields,
        image: result.secure_url,
        creator: user.id,
      },
    });
  } catch (error) {
    console.error("❌ Upload/DB error:", error);
    return res.status(500).json({ error: error.message });
  }
}
