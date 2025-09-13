"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaSchool, FaBars, FaTimes, FaUserPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 px-6 py-4 text-white shadow-md flex items-center justify-between relative"
    >
      {/* Logo */}
      <Link href="/">
        <motion.div
          className="flex items-center space-x-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <FaSchool className="text-2xl text-yellow-300" />
          <span className="text-lg font-bold tracking-wide">SchoolHub</span>
        </motion.div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 items-center">
        <Link href="/showSchools" className="hover:text-yellow-300">
          Schools
        </Link>
        {user ? (
          <>
            <Link href="/addSchool" className="hover:text-yellow-300">
              Add School
            </Link>
            <motion.button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link href="/register" className="flex items-center gap-1 hover:text-yellow-300">
              <FaUserPlus /> Register
            </Link>
            <Link href="/login" className="flex items-center gap-1 hover:text-yellow-300">
              <FaSignInAlt /> Login
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <FaTimes className="text-2xl text-yellow-300" /> : <FaBars className="text-2xl text-yellow-300" />}
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
            <Link href="/showSchools" onClick={() => setIsOpen(false)}>Schools</Link>
            {user ? (
              <>
                <Link href="/addSchool" onClick={() => setIsOpen(false)}>Add School</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
