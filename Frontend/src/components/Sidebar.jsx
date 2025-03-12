import { Link } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../components/store/UseAuth"; // Import the custom hook


export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth(); // Get user & loading state

  return (
    <>
      {/* ☰ Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 bg-gray-800 text-white rounded fixed top-4 left-4 z-50"
      >
        ☰
      </button>

      {/* ✅ Sidebar Panel (Fixed & Non-Scrollable) */}
      <div
        className={`fixed top-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50 
        bg-gray-800 text-white w-64 h-screen p-4 flex flex-col shadow-lg overflow-hidden`}
      >
        {/* ✖ Close Button (Only for Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white text-xl absolute top-4 right-4"
        >
          ✖
        </button>

        {/* 🔥 Sidebar Heading */}
        <h2 className="text-xl font-bold mb-4">Learning Go</h2>

        {/* 👤 Profile Section */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <FaUserCircle className="text-3xl" />
          <div>
            {loading ? (
              <p className="text-sm font-semibold">Loading...</p>
            ) : user ? (
              <>
                <p className="text-sm font-semibold">Welcome, {user.username}!</p>
                <Link to="/profile" className="text-blue-400 text-sm hover:underline">
                  View Profile
                </Link>
              </>
            ) : (
              <p className="text-sm font-semibold">Guest</p>
            )}
          </div>
        </div>

        {/* 🔗 Navigation Links */}
        <nav className="space-y-2 flex-1">
          <Link
            to="/"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/categories"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/bookmarked"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Bookmarked
          </Link>
          <Link
            to="/settings"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </nav>

        {/* 🔑 Auth Buttons */}
        <div className="flex mt-auto justify-evenly">
          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("token"); // Logout by removing token
                window.location.reload(); // Reload to reflect changes
              }}
              className="block p-2 rounded hover:bg-gray-700 border border-gray-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block p-2 rounded hover:bg-gray-700 border border-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block p-2 rounded hover:bg-gray-700 border border-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
