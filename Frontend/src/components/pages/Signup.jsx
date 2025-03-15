import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobileNumber: "", // Default empty string
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    if (!form.mobileNumber.trim()) {
      toast.error("Mobile number is required!");
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
      console.log("🔹 Signup Response:", data); // Debugging API response
  
      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please check your details.");
      }
  
      if (!data.token) {
        throw new Error("❌ Token not received from server!");
      }
  
      // ✅ Store authentication token & user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      console.log("✅ Token stored:", data.token); // Debugging token storage
  
      toast.success("Signup successful! Redirecting...");
  
      // Redirect user
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleOAuthLogin = (provider) => {
    window.open(`${BASE_URL}/oauth/${provider}`, "_self");
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    const mobileNumber = new URLSearchParams(window.location.search).get("mobileNumber") || ""; // Default if missing
    
    if (token) {
      localStorage.setItem("token", token);
      setForm((prevForm) => ({ ...prevForm, mobileNumber }));
      navigate("/");
    }
  }, []);

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
          <motion.input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <motion.input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <motion.input type="text" name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <motion.input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded w-full mb-3" required />
          <motion.button type="submit" className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </motion.button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <motion.button onClick={() => handleOAuthLogin("google")} className="bg-red-500 text-white p-2 rounded w-full mb-3 flex items-center justify-center">
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" /> Signup with Google
        </motion.button>

        <motion.button onClick={() => handleOAuthLogin("github")} className="bg-gray-800 text-white p-2 rounded w-full flex items-center justify-center">
          <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" /> Signup with GitHub
        </motion.button>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
