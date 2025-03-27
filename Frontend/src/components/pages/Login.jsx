import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Ensure both fields are filled
    if (!formData.mobileNumber.trim() || !formData.password.trim()) {
      setError("⚠️ Please enter both mobile number and password.");
      setLoading(false);
      return;
    }

    // ✅ Fix: Change "type" to "authProvider"
    const requestBody = {
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      authProvider: "manual",  // ✅ Correct field name
    };

    try {
      console.log("📤 Sending Login Request:", requestBody);

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();


      console.log("✅ Login Success:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id); 
      console.log("✅ Stored userId:", data.user.id);
      console.log("✅ Stored Token:", data.token);
      navigate("/profile");

    } catch (err) {

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  // Handle OAuth Login
  const handleOAuthLogin = (provider) => {
    window.location.href = `${BASE_URL}/oauth/${provider}`;
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen gradient-bg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md p-8 gradient-bg
 rounded-lg shadow-lg"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* 🔹 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full gradient
 text-white py-3 rounded-md hover:brightness-90
 transition-all"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
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
          className="w-full gradient-2
 text-white py-3 rounded-md hover:brightness-90
 transition-all flex items-center justify-center space-x-2 mb-3"
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

        {/* 🔹 Signup Link */}
        <p className="text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
