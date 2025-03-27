import { useState, useEffect } from "react";

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
    <div className="gradient-bg brightness-105 p-4 rounded-lg mt-4 flex flex-col items-center">
      {error && <p className="text-red-500">{error}</p>}

      {inviteCode ? (
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-700 font-semibold">{inviteCode}</p>
          <button
            onClick={handleCopy}
            className="gradient-2
 text-white px-3 py-1 rounded-md hover:brightness-90
 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
      ) : (
        <button
          onClick={generateInviteCode}
          className="gradient-2
 text-white px-4 py-2 rounded-md hover:brightness-90
 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Invite Code"}
        </button>
      )}
    </div>
  );
};

export default InviteCode;
