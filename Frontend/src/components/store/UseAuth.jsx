import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/auth"; // Ensure correct base URL

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found in localStorage");

        // ✅ Home (`/`) pe redirect mat karo
        if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login"); // Send only to login page
        }
        
        setLoading(false);
        return;
      }

      try {
        console.log("🔹 Fetching user data...");
        console.log("🔑 Stored Token:", token);

        const response = await fetch(`${BASE_URL}/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("⚠️ Token expired or invalid, logging out...");
            localStorage.removeItem("token");
            setUser(null);

            // ✅ Home pe mat bhejo, sirf login pe bhejo
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

        console.log("✅ User data fetched:", data.user);
        setUser(data.user);
      } catch (error) {
        console.error("❌ Auth error:", error.message);

        // ✅ Home pe mat bhejo, sirf login pe bhejo
        if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]); // ✅ Dependency array me location.pathname add kiya hai

  return { user, loading };
}
