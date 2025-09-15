"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "../../src/app/globals.css";
import { useAuth,loadingAuth } from "@/context/AuthContext";
import Navbar from "./navBar";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // 🔒 Protect Route
 const { user, loadingAuth } = useAuth();

useEffect(() => {
  if (!loadingAuth && (!user || !user.token)) {
    router.replace("/register");
  }
}, [user, loadingAuth, router]);

if (loadingAuth) return null; // ⏳ wait until auth finishes

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

  // Prevent showing form briefly before redirect
  if (!user || !user.token) {
    return null; // render nothing while redirecting
  }

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
      {/* your form UI as before */}
    </>
  );
}
