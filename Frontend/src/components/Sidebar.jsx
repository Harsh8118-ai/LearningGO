import { Link } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button (☰) */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden p-2 bg-gray-800 text-white rounded fixed top-4 left-4 z-50"
      >
        ☰
      </button>

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                      md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50 bg-gray-800 text-white w-64 h-full p-4 flex flex-col shadow-lg`}>

        {/* Close Button (Only for Mobile) */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden text-white text-xl absolute top-4 right-4"
        >
          ✖
        </button>

        {/* Sidebar Heading */}
        <h2 className="text-xl font-bold mb-4">Learning Go</h2>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1">
          <Link to="/" className="block p-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/categories" className="block p-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link to="/bookmarked" className="block p-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Bookmarked</Link>
          <Link to="/settings" className="block p-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Settings</Link>
          
          {/* Profile (Inside Nav) */}
          <Link to="/profile" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>
            <FaUserCircle className="text-xl" />
            Profile
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex mt-auto justify-evenly">
          <Link to="/login" className="block p-2 rounded hover:bg-gray-700 border border-gray-600" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/signup" className="block p-2 rounded hover:bg-gray-700 border border-gray-600" onClick={() => setIsOpen(false)}>Signup</Link>
        </div>
      </div>
    </>
  );
}
