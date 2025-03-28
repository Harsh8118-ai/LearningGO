import { useState, useEffect } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa";

const InviteCode = () => {
  const [inviteCode, setInviteCode] = useState(localStorage.getItem("inviteCode") || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;


  // ✅ Fetch Invite Code if it Exists
  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/friends/invite-code`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setInviteCode(data.inviteCode || "");
          localStorage.setItem("inviteCode", data.inviteCode);
        } else {
          setError(data.message);
          setInviteCode("");
        }
      } catch (error) {
        console.error("Error fetching invite code:", error);
        setError("Failed to fetch invite code!");
      }
    };

    fetchInviteCode();
  }, [inviteCode]); // Fetch again if inviteCode changes

  // ✅ Generate Invite Code
  const generateInviteCode = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/friends/generate-invite-code`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setInviteCode(data.inviteCode);
        localStorage.setItem("inviteCode", data.inviteCode);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error generating invite code:", error);
      setError("Failed to generate invite code!");
    }
    setLoading(false);
  };

  // ✅ Copy Invite Code
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      {inviteCode ? (
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
          <p className="text-lg font-semibold text-gray-300">{inviteCode}</p>
          <button
            onClick={handleCopy}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md flex items-center gap-2 transition"
          >
            {copied ? <FaCheck /> : <FaClipboard />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <button
          onClick={generateInviteCode}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition font-semibold"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Invite Code"}
        </button>
      )}
    </div>
  );
};

export default InviteCode;
