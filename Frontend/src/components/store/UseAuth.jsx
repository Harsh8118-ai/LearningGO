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
          console.error("No token found");
          navigate("/login");
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
        console.log("🔹 API Response Data:", data);

        if (!response.ok || !data.userData) {
          throw new Error("Failed to fetch user");
        }

        console.log("✅ Setting user state...");
        setUser(data.userData);
      } catch (error) {
        console.error("❌ Failed to fetch user:", error.message);
        navigate("/login");
      } finally {
        console.log("🔄 Setting loading to false...");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { user, loading };
}
