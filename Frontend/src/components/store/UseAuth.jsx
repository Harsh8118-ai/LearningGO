import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          
          // Allow public pages, redirect only if necessary
          const publicRoutes = ["/login", "/signup", "/"];
          if (!publicRoutes.includes(window.location.pathname)) {
            navigate("/login");
          }
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

        if (!response.ok || !data.userData) {
          throw new Error("Failed to fetch user");
        }

        setUser(data.userData);
      } catch (error) {
        console.error("Auth error:", error.message);
        
        // Redirect only if needed
        if (!["/login", "/signup"].includes(window.location.pathname)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { user, loading };
}
