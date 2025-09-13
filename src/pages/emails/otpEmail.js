import * as React from "react";

export default function OtpEmail({ name, otp }) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "480px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
        color: "#333",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#1e40af", fontWeight: "700", marginBottom: "16px" }}>
        Hi {name},
      </h2>
      <p style={{ fontSize: "16px", marginBottom: "8px" }}>
        Here’s your <strong>One-Time Password (OTP)</strong> to verify your email:
      </p>
      <h1
        style={{
          color: "#2563eb",
          fontSize: "48px",
          letterSpacing: "6px",
          margin: "24px 0",
          fontWeight: "900",
          fontFamily: "'Courier New', Courier, monospace",
          userSelect: "text",
        }}
      >
        {otp}
      </h1>
      <p style={{ color: "#555", fontSize: "14px", marginBottom: "24px" }}>
        This OTP is valid for <strong>10 minutes</strong>.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        Thanks,<br />
        <span style={{ color: "#1e40af", fontWeight: "600" }}>Your App Team</span>
      </p>
    </div>
  );
}
