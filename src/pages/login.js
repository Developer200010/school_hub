// pages/login.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../app/globals.css"
export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    // ✅ Call backend login API
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data)
    if (data) {
      login(data);
      router.push("/");
    } else {
      alert("Login failed: " + data.error);
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="w-full border px-3 py-2 rounded mb-3" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
        className="w-full border px-3 py-2 rounded mb-3" />
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
    </form>
  );
}
