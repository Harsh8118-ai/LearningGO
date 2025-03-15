import { useState, useEffect } from "react";

const InviteCode = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Fetch Invite Code if it Exists
  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/friends/invite-code", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) setInviteCode(data.inviteCode);
      } catch (error) {
        console.error("Error fetching invite code:", error);
      }
    };

    fetchInviteCode();
  }, []);

  // ✅ Generate Invite Code when Button is Clicked
  const generateInviteCode = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/friends/generate-invite-code", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) setInviteCode(data.inviteCode);
    } catch (error) {
      console.error("Error generating invite code:", error);
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
    <div className="bg-gray-100 p-4 rounded-lg mt-4 flex flex-col items-center">
      {inviteCode ? (
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-700 font-semibold">{inviteCode}</p>
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
      ) : (
        <button
          onClick={generateInviteCode}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Invite Code"}
        </button>
      )}
    </div>
  );
};

export default InviteCode;
