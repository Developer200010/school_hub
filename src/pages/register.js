"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "../app/globals.css"
export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Submit registration to send OTP
  const handleRegister = async (data) => {
    setLoading(true);
    try {
      setEmail(data.email); // save for OTP verification
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert("✅ OTP sent to your email.");
      } else {
        alert("❌ " + (result.error || "Failed to register."));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP.");
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("✅ Email verified! Redirecting to schoolHub...");
        router.push("/login"); // change as needed
      } else {
        alert("❌ " + (result.error || "Invalid OTP."));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        {!otpSent ? (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <h1 className="text-xl font-bold text-center mb-4">Register</h1>
            <input
              placeholder="Name"
              {...register("name", { required: "Name required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            <input
              placeholder="Email"
              {...register("email", { required: "Email required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-center font-semibold">Enter OTP sent to {email}</h2>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded text-center"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
