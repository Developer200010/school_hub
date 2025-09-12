import { Resend } from "resend";
import { render } from "@react-email/render";
import OtpEmail from "@/pages/emails/otpEmail";
import { createConnection } from "@/utils/db";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = await createConnection();

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Insert or update user with hashed password + OTP
    await db.query(
      `INSERT INTO users (name, email, password, otp, otp_expiry, verified)
       VALUES (?, ?, ?, ?, ?, false)
       ON DUPLICATE KEY UPDATE otp=?, otp_expiry=?, verified=false`,
      [name, email, hashedPassword, otp, expiry, otp, expiry]
    );

    // Render email template
    const emailHtml = await render(<OtpEmail name={name} otp={otp} />);

    // Send email with Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: emailHtml,
    });

    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
}
