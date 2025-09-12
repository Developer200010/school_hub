import { createConnection } from "@/utils/db";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const db = await createConnection();

    // Get user by email
    const [rows] = await db.query(
      "SELECT otp, otp_expiry, verified FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Already verified
    if (user.verified) {
      return res.status(200).json({ success: true, message: "Already verified" });
    }

    // OTP mismatch
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(user.otp_expiry);
    if (now > expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // ✅ Mark user as verified
    await db.execute("UPDATE users SET verified = true WHERE email = ?", [email]);

    return res.status(200).json({ success: true, message: "Email verified successfully!" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
