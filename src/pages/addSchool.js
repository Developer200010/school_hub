"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "../../src/app/globals.css";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./navBar";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loadingAuth } = useAuth();

  // 🔒 Protect Route
  useEffect(() => {
    if (!loadingAuth && (!user || !user.token)) {
      router.replace("/register");
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth) return null; // ⏳ wait until auth check completes

  const onSubmit = async (data) => {
    setSubmitStatus("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("email", data.email);
      formData.append("image", data.image[0]);

      const res = await fetch("/api/addSchool", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setSubmitStatus("✅ School added successfully!");
        reset();
        setTimeout(() => router.push(`/`), 1000);
      } else {
        const result = await res.json();
        setSubmitStatus("❌ Error: " + (result.message || "Failed to add school."));
      }
    } catch (error) {
      setSubmitStatus("⚠️ Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.token) return null; // extra safeguard

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <h1 className="text-2xl font-bold text-indigo-700 text-center">Add New School</h1>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">School Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows={3}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Invalid contact number",
                },
              })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.contact ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.contact && <p className="text-red-600 text-sm">{errors.contact.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">School Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              className="w-full border rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
          </div>

          {/* Status Message */}
          {submitStatus && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center font-medium ${
                submitStatus.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {submitStatus}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
          >
            {loading ? "Submitting..." : "Add School"}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
}
