"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import "../../app/globals.css"
import {
  FaMapMarkerAlt,
  FaCity,
  FaGlobeAmericas,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';
import Navbar from '../navBar'; // Adjust path as needed
import "../../app/globals.css"; // Adjust path as needed

export default function SingleSchoolDetails({ school: initialSchool }) {
  const router = useRouter();
  const [school, setSchool] = useState(initialSchool);
  const [loading, setLoading] = useState(!initialSchool);

  useEffect(() => {
    // Fetch school data client-side if not preloaded
    if (!initialSchool && router.query.id) {
      setLoading(true);
      fetch(`/api/getSchoolById?id=${router.query.id}`)
        .then(res => res.json())
        .then(data => {
          setSchool(data.result || data || null);
          console.log(school)
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [router.query.id, initialSchool]);

  if (loading || router.isFallback) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-red-600 text-lg font-semibold"
        >
          School not found!
        </motion.p>
      </div>
    );
  }

  // const imageSrc = school.image?.startsWith('http')
  //   ? school.image
  //   : `/schoolImages/${school.image}`;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden hover:shadow-blue-200"
        >
          <motion.img
            src={school.image}
            alt={school.name}
            className="w-full h-80 object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{school.name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                <span>{school.address}</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <FaCity className="text-green-600 text-xl" />
                <span>{school.city}</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <FaGlobeAmericas className="text-purple-600 text-xl" />
                <span>{school.state}</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <FaPhoneAlt className="text-orange-600 text-xl" />
                <span>{school.contact}</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 sm:col-span-2"
              >
                <FaEnvelope className="text-red-600 text-xl" />
                <span>{school.email_id || school.email}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// Server-side render - fetch single school by id from API
export async function getServerSideProps(context) {
  const { id } = context.params;

  // Detect if running locally or in prod
  const protocol = context.req.headers.host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${context.req.headers.host}`;

  try {
    const res = await fetch(`${baseUrl}/api/getSchoolById?id=${id}`);

    if (!res.ok) throw new Error("School not found");
    const data = await res.json();

    return {
      props: {
        school: data.result || data || null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: { school: null },
    };
  }
}

