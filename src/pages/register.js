"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../app/globals.css";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      setEmail(data.email);
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
        router.push("/login");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-indigo-100 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        {!otpSent ? (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
            <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
              Register
            </h1>
            <input
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            <input
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailRegex,
                  message: "Invalid email format",
                },
              })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordRegex,
                    message:
                      "Password must be at least 8 characters, include uppercase, lowercase, number and special character",
                  },
                })}
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/4 transform -translate-y-2/4 text-indigo-600"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>

            {/* 👇 Extra Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <h2 className="text-center font-semibold text-lg text-indigo-700">
              Enter OTP sent to <span className="font-mono">{email}</span>
            </h2>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition duration-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* 👇 Always show Home button here too */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full mt-3 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Home
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
