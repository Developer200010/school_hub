"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./navBar.js";
import "../app/globals.css";
import Link from "next/link";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch("/api/getSchools");
        const data = await res.json();
        setSchools(data.result || []);
      } catch (error) {
        console.error("Failed to load schools", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

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
          // ✅ Loader
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
                      <div className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition cursor-pointer bg-white">
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
                    className={`px-3 py-2 rounded-lg font-medium transition ${
                      currentPage === i + 1
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
    </>
  );
}
