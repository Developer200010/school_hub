"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "../../src/app/globals.css";
import Navbar from "./navBar.js";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      body: formData,
    });
console.log(res)
    if (res.ok) {
      setSubmitStatus("✅ School added successfully!");
      reset();
      setTimeout(() => {
        // Optional: Only navigate if insertId exists
          router.push(`/`);
      }, 1000);
    } else {
      setSubmitStatus("❌ Error: " + (result.message || "Failed to add school."));
    }
  } catch (error) {
    setSubmitStatus("⚠️ Network error: " + error.message);
  } finally {
    setLoading(false);
  }
};

  const fields = [
    { label: "Name", type: "text", name: "name", rules: { required: "Name is required" } },
    { label: "Address", type: "textarea", name: "address", rules: { required: "Address is required" } },
    { label: "City", type: "text", name: "city", rules: { required: "City is required" } },
    { label: "State", type: "text", name: "state", rules: { required: "State is required" } },
    { label: "Contact Number", type: "tel", name: "contact", rules: { required: "Contact number is required", pattern: { value: /^[0-9]{10,15}$/, message: "Invalid contact number" } } },
    { label: "Email", type: "email", name: "email", rules: { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } } },
    { label: "School Image", type: "file", name: "image", rules: { required: "Image is required" } },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white shadow-lg rounded-xl p-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6 text-center text-indigo-700"
          >
            Add School
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm text-black">
            {fields.map((field, idx) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <label className="block mb-1 font-medium">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    {...register(field.name, field.rules)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <input
                    type={field.type}
                    accept={field.type === "file" ? "image/*" : undefined}
                    {...register(field.name, field.rules)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-600 text-xs mt-1">{errors[field.name].message}</p>
                )}
              </motion.div>
            ))}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-md shadow transition text-sm font-medium ${loading ? "opacity-80 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Add School"
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {submitStatus && (
              <motion.p
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className={`mt-4 text-center text-sm font-medium ${
                  submitStatus.startsWith("✅")
                    ? "text-green-600"
                    : submitStatus.startsWith("❌")
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {submitStatus}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
