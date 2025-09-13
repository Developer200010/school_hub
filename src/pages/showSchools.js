"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import "../app/globals.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./navBar";

export default function ShowSchools() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth()
  const itemsPerPage = 6;
  // ✅ For Edit Modal
  const [editingSchool, setEditingSchool] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await fetch("/api/getSchools");
      const data = await res.json();
      setSchools(data.result || []);
    } catch (error) {
      console.error("Failed to load schools", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this school?")) return;

    try {
      const res = await fetch(`/api/deleteSchool?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (res.ok) {
        setSchools((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (school) => {
    setEditingSchool(school.id);
    setFormData({
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      contact: school.contact,
      email: school.email,
      image: school.image,
    });
  };

  // ✅ Update Handler
  const handleUpdate = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("email", data.email);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]); // only append if new image is chosen
      }

      const res = await fetch(`/api/updateSchool?id=${editingSchool}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setSchools((prev) =>
          prev.map((s) => (s.id === editingSchool ? { ...s, ...updated.school } : s))
        );
        setEditingSchool(null); // close modal
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false)
    }
  };
  // ✅ Pagination logic
  const totalPages = Math.ceil(schools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSchools = schools.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Schools Directory
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <span className="text-gray-600 text-lg">Loading schools...</span>
          </div>
        ) : schools.length > 0 ? (
          <>
            {/* ✅ Schools Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {currentSchools.map((school) => (
                  <motion.div
                    key={school.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/schoolDetails/${school.id}`}>
                      <div className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition bg-white">
                        <motion.img
                          src={school.image}
                          alt={school.name}
                          className="w-full h-48 object-cover mb-4 rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        <h2 className="font-semibold text-lg text-gray-800">
                          {school.name}
                        </h2>
                        <p className="text-gray-600">{school.address}</p>
                        <p className="text-gray-500">{school.city}</p>

                        {/* ✅ Action Buttons */}
                        {user && user.user.id === school.creator_id && (
                          <div className="flex justify-end space-x-3 mt-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleEdit(school);
                              }}
                              className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                              title="Edit School"
                              aria-label="Edit School"
                            >
                              <AiOutlineEdit className="mr-1" size={18} />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(school.id);
                              }}
                              className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                              title="Delete School"
                              aria-label="Delete School"
                            >
                              <AiOutlineDelete className="mr-1" size={18} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-40 transition"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">No schools found.</p>
        )}
      </div>

      {/* ✅ Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>

            <form
              onSubmit={handleSubmit(handleUpdate)}
              className="space-y-4 text-sm text-black"
            >
              <input
                type="text"
                placeholder="School Name"
                defaultValue={formData.name}
                {...register("name", { required: "Name is required" })}
                className="w-full border rounded p-2 mb-3"
              />
              {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}

              <textarea
                placeholder="Address"
                defaultValue={formData.address}
                {...register("address", { required: "Address is required" })}
                className="w-full border rounded p-2 mb-3"
              />
              {errors.address && <p className="text-red-600 text-xs">{errors.address.message}</p>}

              <input
                type="text"
                placeholder="City"
                defaultValue={formData.city}
                {...register("city", { required: "City is required" })}
                className="w-full border rounded p-2 mb-3"
              />
              {errors.city && <p className="text-red-600 text-xs">{errors.city.message}</p>}

              <input
                type="text"
                placeholder="State"
                defaultValue={formData.state}
                {...register("state")}
                className="w-full border rounded p-2 mb-3"
              />

              <input
                type="tel"
                placeholder="Contact"
                defaultValue={formData.contact}
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid contact number",
                  },
                })}
                className="w-full border rounded p-2 mb-3"
              />
              {errors.contact && <p className="text-red-600 text-xs">{errors.contact.message}</p>}

              <input
                type="email"
                placeholder="Email"
                defaultValue={formData.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                className="w-full border rounded p-2 mb-3"
              />
              {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full border rounded p-2 mb-3"
              />

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading ? "please wait..." : "update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
