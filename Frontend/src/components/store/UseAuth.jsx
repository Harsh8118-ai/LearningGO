import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to generate a 6-digit numeric invite code from userId
  const generateInviteCode = (userId) => {
    const last6Chars = userId.slice(-6);
    let numericCode = parseInt(last6Chars, 16) % 1000000;
    return `${numericCode.toString().padStart(6, "0")}`;
  };
  

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
        const response = await fetch(`${BASE_URL}/auth/user`, {
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
        if (!data.user || !data.user._id) {
          throw new Error("Invalid response: user ID not found");
        }

        let userInviteCode = data.user.inviteCode;

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
