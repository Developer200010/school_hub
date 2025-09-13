import formidable from "formidable";
import cloudinary from "cloudinary";
import { createConnection } from "@/utils/db";
import { verifyToken } from "../utils/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js body parsing (needed for formidable)
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Auth check
  const { valid, user, message } = verifyToken(req, res);
  if (!valid) {
    return res.status(401).json({ error: message });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "School ID is required" });

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ error: "Invalid form data" });
      }

      const { name, address, city, state, contact, email } = fields;
      console.log(name, address)
      let imageUrl = null;

      // ✅ If new image provided → upload to Cloudinary
      if (files.image) {
        const fileObj = Array.isArray(files.image) ? files.image[0] : files.image;

        if (fileObj && fileObj.filepath) {
          const uploadRes = await cloudinary.v2.uploader.upload(fileObj.filepath, {
            folder: "schoolhub",
          });
          imageUrl = uploadRes.secure_url;
        }
      }

      const conn = await createConnection();

      // ✅ Fetch existing school (to keep old image if no new one uploaded)
      const [existing] = await conn.query(
        "SELECT * FROM schools WHERE id=? AND creator_id=?",
        [id, user.id]
      );
      if (!existing.length) {
        return res.status(404).json({ error: "School not found or not authorized" });
      }

      const finalImage = imageUrl || existing[0].image;

      // ✅ Update school
      const [result] = await conn.query(
        `UPDATE schools 
         SET name=?, address=?, city=?, state=?, contact=?, email=?, image=? 
         WHERE id=? AND creator_id=?`,
        [name, address, city, state, contact, email, finalImage, id, user.id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Update failed (maybe not authorized)" });
      }

      // ✅ Return updated school
      return res.status(200).json({
        message: "School updated successfully",
        school: {
          id,
          name,
          address,
          city,
          state,
          contact,
          email,
          image: finalImage,
        },
      });
    });
  } catch (error) {
    console.error("Update school error:", error);
    return res.status(500).json({ error: "Server error while updating school" });
  }
}
