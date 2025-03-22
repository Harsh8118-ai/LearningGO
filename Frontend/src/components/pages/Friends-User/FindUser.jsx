import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast

const FindUser = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // ✅ React Router navigation

  // 🔎 Find user by invite code
  const searchUser = async () => {
    if (!inviteCode.trim()) {
      setError("Invite code cannot be empty!");
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/friends/search-by-invite?code=${inviteCode}`);
      console.log("API Response:", response.data);

      if (response.data && response.data.username) {
        setUser(response.data);
      } else {
        setError("User not found.");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error searching user.");
    }

    setLoading(false);
  };

  // ✉️ Send Friend Request
  const sendFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("📌 Sending request with token:", token);
      
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }
  
      console.log("📌 Invite Code before sending request:", inviteCode);
  
      const response = await axios.post(
        "http://localhost:5000/api/friends/send-request",
        { inviteCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ Friend request sent:", response.data);

      // ✅ Show success toast
      toast.success("Friend request sent successfully!");

      // ✅ Navigate to the friend requests page
      navigate("/friend-requests");

    } catch (error) {
      console.error("❌ Error sending request:", error);
      setError(error.response?.data?.message || "Failed to send request.");
      toast.error("Failed to send request!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-gray-200 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Find User by Invite Code</h2>

      <input
        type="text"
        placeholder="Enter Invite Code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={searchUser}
        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Searching..." : "Find User"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {user && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold">User Found</h3>
          <p><strong>Username:</strong> {user.username || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Invite Code:</strong> {user.inviteCode || "N/A"}</p>
          <button
            onClick={sendFriendRequest}
            className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Send Friend Request
          </button>
        </div>
      )}
    </div>
  );
};

export default FindUser;
