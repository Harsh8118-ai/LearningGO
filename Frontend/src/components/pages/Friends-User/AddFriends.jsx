import { useState, useEffect } from "react";
import axios from "axios";

const AddFriends = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user's invite code
  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const res = await axios.get("/api/friends/invite-code");
        setGeneratedCode(res.data.inviteCode);
      } catch (error) {
        console.error("Error fetching invite code:", error);
      }
    };
    fetchInviteCode();
  }, []);

  // Generate Invite Code
  const generateInviteCode = async () => {
    try {
      const res = await axios.post("/api/friends/generate-invite-code");
      setGeneratedCode(res.data.inviteCode);
      setMessage("✅ Invite code generated successfully!");
    } catch (error) {
      setMessage("❌ Error generating invite code!");
      console.error(error);
    }
  };

  // Send Friend Request
  const sendFriendRequest = async () => {
    if (!friendCode) {
      setMessage("❌ Please enter an invite code!");
      return;
    }

    try {
      const res = await axios.post("/api/friends/send-request", { inviteCode: friendCode });
      setMessage("✅ Friend request sent successfully!");
      setFriendCode("");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error sending request!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Friends</h2>

      {/* Display User's Invite Code */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
        {generatedCode ? (
          <p className="text-gray-700 font-medium">Your Invite Code: <span className="font-bold">{generatedCode}</span></p>
        ) : (
          <button onClick={generateInviteCode} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
            Generate Invite Code
          </button>
        )}
      </div>

      {/* Input for Entering Friend's Invite Code */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter friend's invite code"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          className="border p-2 flex-1 rounded-md"
        />
        <button onClick={sendFriendRequest} className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600">
          Add Friend
        </button>
      </div>

      {/* Message Display */}
      {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
    </div>
  );
};

export default AddFriends;
