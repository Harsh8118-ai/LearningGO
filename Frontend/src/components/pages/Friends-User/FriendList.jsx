import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";  // 🔹 Import for navigation
import { FaTrash, FaEnvelope } from "react-icons/fa";  // 🔹 Import icons

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();  // 🔹 Hook for navigation

    useEffect(() => {
        AOS.init({ duration: 800 });

        const fetchFriends = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/friends/friends-list", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Check if the response contains friends
                setFriends(response.data.friends || []);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load friends.");
                toast.error("Failed to load friends.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    // 🗑 Remove Friend Function
    const handleRemoveFriend = async (friendId) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/friends/remove",
                { friendId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
            toast.success("Friend removed successfully!");
        } catch (error) {
            setError("Error removing friend.");
            toast.error("Error removing friend.");
        }
    };

    // ✉️ Navigate to Chat Function
    const handleMessage = (friendId, friendUsername) => {
        navigate(`/chat/${friendId}`, { state: { friendUsername } });
    };


    return (
        <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Friend List</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
            ) : friends.length > 0 ? (
                friends.map((friend) => (
                    <motion.div
                        key={friend._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 border rounded-md bg-gray-100 mt-2 flex justify-between items-center"
                    >
                        <div>
                            <p><strong>Username:</strong> {friend.username || "N/A"}</p>
                            <p><strong>Email:</strong> {friend.email || "N/A"}</p>
                        </div>

                        <div className="flex gap-3">
                            {/* ✉️ Message Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                                onClick={() => handleMessage(friend._id, friend.username)} // ✅ Pass username
                            >
                                <FaEnvelope />
                            </motion.button>


                            {/* 🗑 Remove Friend Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                                onClick={() => handleRemoveFriend(friend._id)}
                            >
                                <FaTrash />
                            </motion.button>
                        </div>
                    </motion.div>
                ))
            ) : (
                <p className="text-gray-500 text-center">No friends added yet.</p>
            )}
        </div>
    );
};

export default FriendList;
