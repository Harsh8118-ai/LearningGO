import { useEffect, useState } from "react";
import axios from "axios";
import ThemeSwitcher from "./ThemeSwitch";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Settings = () => { 
  const [user, setUser] = useState({ username: "", email: "", mobileNumber: "" });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [editStep, setEditStep] = useState("edit");
  const location = useLocation(); 

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const section = query.get("tab");
    if (section === "edit") setActiveTab("edit");
  }, [location.search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (field) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/auth/update-profile`,
        { [field]: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${field} updated successfully!`);
      setUser((prev) => ({ ...prev, [field]: newValue }));
      resetModal();
    } catch (error) {
      alert(`Failed to update ${field}.`);
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/otp/send-otp`, {
        email:
          isModalOpen === "password" || isModalOpen === "email"
            ? user.email
            : undefined,
        mobileNumber: isModalOpen === "mobileNumber" ? user.mobileNumber : undefined,
      });
      alert("OTP sent!");
      setIsOtpSent(true);
      setEditStep("verify");
    } catch (error) {
      alert("Failed to send OTP.");
    }
  };

  const verifyAndUpdate = async () => {
    try {
      await axios.post(`${BASE_URL}/otp/verify-otp`, {
        email:
          isModalOpen === "password" || isModalOpen === "email"
            ? user.email
            : undefined,
        mobileNumber: isModalOpen === "mobileNumber" ? user.mobileNumber : undefined,
        otp,
      });

      if (isModalOpen === "password") {
        await axios.put(`${BASE_URL}/auth/reset-password`, {
          email: user.email,
          otp,
          newPassword,
        });
      } else {
        await handleUpdateProfile(isModalOpen);
      }

      alert("Verified & updated!");
      resetModal();
    } catch (error) {
      alert("OTP verification failed.");
    }
  };

  const resetModal = () => {
    setIsModalOpen(null);
    setEditStep("edit");
    setOtp("");
    setNewPassword("");
    setIsOtpSent(false);
  };

  const tabClass = (tab) =>
    `px-4 py-2 rounded-xl font-medium text-sm ${
      activeTab === tab
        ? "bg-gray-800 text-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="p-4 sm:p-6 md:p-10 text-white mt-10 sm:mt-10">
      <motion.div className="bg-gray-950 border border-gray-700 rounded-2xl shadow-xl max-w-4xl mx-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Settings</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTab("edit")} className={tabClass("edit")}>
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={tabClass("settings")}
            >
              Preferences
            </button>
          </div>
        </div>

        {activeTab === "edit" && (
          <div className="p-6 space-y-4">
            {["username", "email", "mobileNumber"].map((field) => (
              <div
                key={field}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <p className="text-lg">
                  <strong className="text-white capitalize">{field}:</strong>{" "}
                  {user[field]}
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(field);
                    setNewValue(user[field]);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-lg">
                <strong>Password:</strong> ********
              </p>
              <button
                onClick={() => setIsModalOpen("password")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
            <ThemeSwitcher />
          </div>
        )}
      </motion.div>

      {/* Shared Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-gray-900 p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg relative">
            {/* Close */}
            <button
              onClick={resetModal}
              className="absolute top-2 right-3 text-white text-xl hover:text-red-500"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4 capitalize">
              Edit {isModalOpen}
            </h3>

            {/* Step 1: Input */}
            {editStep === "edit" && (
              <>
                {isModalOpen === "password" ? (
                  <input
                    placeholder="New Password"
                    className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                ) : (
                  <input
                    className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  {["email", "mobileNumber", "password"].includes(isModalOpen) ? (
                    <button
                      onClick={sendOtp}
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateProfile(isModalOpen)}
                      className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={resetModal}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Step 2: OTP Verify */}
            {editStep === "verify" && (
              <>
                <input
                  placeholder="Enter OTP"
                  className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={verifyAndUpdate}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                  >
                    Verify & Save
                  </button>
                  <button
                    onClick={() => {
                      setEditStep("edit");
                      setOtp("");
                      setIsOtpSent(false);
                    }}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
