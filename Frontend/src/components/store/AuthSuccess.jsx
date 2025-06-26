import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UsernameModal from "./UsernameModal";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");

    
    if (token) {
      try {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        
        localStorage.setItem("username", username);
        localStorage.setItem("userId", decoded.id);

        const newUser = { id: decoded.id, username };
        setUser(newUser);

        setTimeout(() => {
          if (!username || username.startsWith("user_")) {
            setModalOpen(true);
            console.log("🔹 Opening Modal");
          } else {
            navigate("/profile");
          }
        }, 500);
      } catch (error) {
        console.error("❌ Invalid Token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      console.warn("⚠ No token found in URL");
      navigate("/login");
    }
  }, [searchParams, navigate]);


  const handleUsernameUpdated = (newUsername, newToken) => {
    setUser((prev) => ({ ...prev, username: newUsername }));
    localStorage.setItem("token", newToken);
  };

  return (
    <>
      <h1>Welcome, {user?.username || "Guest"}!</h1>

      <UsernameModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onUsernameUpdated={handleUsernameUpdated}
      />
    </>
  );
};

export default AuthSuccess;
