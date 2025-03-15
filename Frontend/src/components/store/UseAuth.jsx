import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/auth"; // Ensure correct base URL

export function useAuth() {
  const [user, setUser] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found in localStorage");

        // Redirect only if not already on login/signup
        if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }

        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
            if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
              navigate("/login");
            }
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.user) {
          throw new Error("Invalid response: user not found");
        }

        let userInviteCode = data.user.inviteCode;

        // Generate invite code if missing
        if (!userInviteCode) {
          userInviteCode = `LearningGo${data.user._id.slice(-6)}`; // Last 6 chars of _id
          await fetch(`${BASE_URL}/update-invite-code`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inviteCode: userInviteCode }),
          });
        }

        // Save in state & localStorage
        setUser(data.user);
        setInviteCode(userInviteCode);
        localStorage.setItem("inviteCode", userInviteCode);
      } catch (error) {
        console.error("❌ Error fetching user:", error.message);

        if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);

  return { user, inviteCode, loading };
}
