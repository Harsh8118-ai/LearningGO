import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:5000/api/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found. Redirecting...");
          setLoading(false);
          navigate("/login");
          return;
        }

        console.log("🔹 Fetching user data...");
        const response = await fetch(`${BASE_URL}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ API Error:", errorData);

          if (response.status === 401) {
            console.warn("⚠️ Unauthorized! Logging out...");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(errorData.message || "Failed to fetch user");
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        // ✅ Fix: API response me `userData` nahi `user` hai
        if (!data?.user) {
          throw new Error("Invalid user data received");
        }

        setUser(data.user); // ✅ Fix applied here
      } catch (error) {
        console.error("❌ Fetch User Data Error:", error.message);
        navigate("/login");
      } finally {
        console.log("🔄 Setting loading to false...");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p className="text-center text-red-500">User data not found. Please log in.</p>;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Welcome, {user?.username || "Guest"} 👋
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Manage your study materials & track your learning progress.
      </p>

      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700">Profile Details</h3>
        <p className="text-gray-600"><strong>Email:</strong> {user?.email}</p>
        <p className="text-gray-600"><strong>Mobile:</strong> {user?.mobileNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white py-3 rounded-lg text-center"
          onClick={() => navigate("/notes")}
        >
          📚 Manage Notes
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-green-600 text-white py-3 rounded-lg text-center"
          onClick={() => navigate("/interview")}
        >
          🎯 Interview Prep
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-purple-600 text-white py-3 rounded-lg text-center"
          onClick={() => navigate("/study-materials")}
        >
          📖 Study Materials
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-600 text-white py-3 rounded-lg text-center"
          onClick={() => navigate("/tests")}
        >
          📝 Practice Tests
        </motion.button>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        🚪 Logout
      </button>
    </motion.div>
  );
};

export default Profile;
