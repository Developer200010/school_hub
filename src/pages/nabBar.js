"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSchool, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 px-6 py-4 text-white shadow-md flex items-center justify-between relative"
    >
      {/* Logo Section */}
      <Link href="/">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaSchool className="text-2xl text-yellow-300" />
          <span className="text-lg font-bold tracking-wide">SchoolHub</span>
        </motion.div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/addSchool"
            className="hover:text-yellow-300 transition-colors"
          >
            Add School
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/showSchools"
            className="hover:text-yellow-300 transition-colors"
          >
            Show Schools
          </Link>
        </motion.div>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? (
            <FaTimes className="text-2xl text-yellow-300" />
          ) : (
            <FaBars className="text-2xl text-yellow-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-indigo-700 flex flex-col items-center space-y-4 py-4 md:hidden shadow-lg"
          >
            <Link
              href="/addSchool"
              onClick={() => setIsOpen(false)}
              className="hover:text-yellow-300 transition-colors text-lg"
            >
              Add School
            </Link>
            <Link
              href="/showSchools"
              onClick={() => setIsOpen(false)}
              className="hover:text-yellow-300 transition-colors text-lg"
            >
              Show Schools
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
