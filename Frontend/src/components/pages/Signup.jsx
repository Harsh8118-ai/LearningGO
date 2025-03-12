import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

 // Access environment variable using import.meta.env
 const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate(); // For redirecting after signup

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // To disable button while submitting
  const [error, setError] = useState(""); // To show error messages

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Signup Error:", data); // Log full error response
        throw new Error(data.message || "Signup failed. Please check your details.");
      }
  
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md w-96"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-bold mb-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Signup
        </motion.h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <motion.input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <motion.input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            whileFocus={{ scale: 1.02 }}
            required
          />

          <motion.button
            type="submit"
            className={`bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
