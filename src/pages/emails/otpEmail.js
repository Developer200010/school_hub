import * as React from "react";

export default function OtpEmail({ name, otp }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>Hi {name},</h2>
      <p>Here’s your OTP to verify your email:</p>
      <h1 style={{ color: "#2563eb", fontSize: "32px" }}>{otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>Thanks, <br /> Your App Team</p>
    </div>
  );
}
