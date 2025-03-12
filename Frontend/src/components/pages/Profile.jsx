import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:5000/api/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Ensure default state is null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
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
          credentials: "include",
        });
  
        const data = await response.json();
        console.log("🔹 API Response Data:", data);
  
        if (!response.ok || !data.userData) {
          throw new Error("Failed to fetch user");
        }
  
        console.log("✅ Setting user state...");
        setUser(data.userData);
      } catch (error) {
        console.error("❌ Failed to fetch user:", error.message);
        navigate("/login");
      } finally {
        console.log("🔄 Setting loading to false...");
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
        onClick={handleLogout}
        className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        🚪 Logout
      </button>
    </motion.div>
  );
};

export default Profile;
