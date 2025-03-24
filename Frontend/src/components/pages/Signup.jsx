import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaGithub } from "react-icons/fa";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    otp: "", // New OTP field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email.trim()) {
      toast.error("Email is required to send OTP!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otpSent) {
      toast.error("Please request and enter OTP before signing up!");
      setLoading(false);
      return;
    }

    const formData = { ...form, authProvider: "manual" };

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth Login
  const handleOAuthLogin = (provider) => {
    window.location.href = `${BASE_URL}/oauth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <input type="text" name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          
          {otpSent && (
            <input type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          )}
          
          {!otpSent ? (
            <button type="button" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600" onClick={sendOtp}>
              Send OTP
            </button>
          ) : (
            <button type="submit" className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          )}
        </form>

        {/* 🔹 OR Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* 🔹 OAuth Login Buttons */}
        <motion.button
          onClick={() => handleOAuthLogin("google")}
          className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-all flex items-center justify-center space-x-2 mb-3"
          whileTap={{ scale: 0.95 }}
        >
          
          <FaGoogle className="w-5 h-5" /> <span>Continue with Google</span>
        </motion.button>

        <motion.button
          onClick={() => handleOAuthLogin("github")}
          className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition-all flex items-center justify-center space-x-2"
          whileTap={{ scale: 0.95 }}
        >
          
          <FaGithub className="w-5 h-5" /> 
          <span>Continue with GitHub</span>
        </motion.button>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
