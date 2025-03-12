import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sidebar } from "./components/Sidebar";
import Categories from "./components/pages/Categories";
import Bookmarked from "./components/pages/Bookmarked";
import Settings from "./components/pages/Settings";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { FaSearch } from "react-icons/fa"; // 🔍 Import Search Icon
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";

export default function App() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", answer: "", tags: "" });
  const [showSearch, setShowSearch] = useState(false); // 🔍 Control Search Bar Visibility

  const addQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ title: "", answer: "", tags: "" });
    setOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={
              <>
                {/* 🔥 Web View: Full Search Bar & Add Button */}
                <div className="hidden md:flex items-center justify-between gap-2 mb-4">
                  <Input
                    placeholder="Search Questions..."
                    className="w-1/2 ml-16 "
                  />
                  <Button onClick={() => setOpen(true)} className="bg-gray-800 text-gray-100">Add Question</Button>
                </div>

                {/* 📱 Mobile View: Search Icon + Add Button */}
                <div className="md:hidden flex flex-col items-center justify-between gap-2 mb-4">
                  
                  {/* 🔍 Expandable Search Bar */}
                  <div className="relative flex items-center w-full justify-end">
                    {showSearch ? (
                      <motion.div
                        initial={{ width: "40px" }}
                        animate={{ width: "90%" }}
                        transition={{ duration: 0.3 }}
                        className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden w-full"
                      >
                        {/* Search Input */}
                        <Input
                          placeholder="Search..."
                          className="px-4 py-2 w-full"
                          autoFocus
                          onBlur={() => setShowSearch(false)} // Hide on blur
                        />
                        {/* Search Icon inside Input */}
                        <FaSearch size={18} className="absolute right-3 text-gray-500" />
                      </motion.div>
                    ) : (
                      /* 🔍 Right-Aligned Search Icon */
                      <button 
                        className="p-2 text-gray-500" // Gray color
                        onClick={() => setShowSearch(true)}
                      >
                        <FaSearch size={20} />
                      </button>
                    )}
                  </div>

                  {/* ➕ Add Question Button */}
                  <Button onClick={() => setOpen(true)} className="bg-gray-800 text-gray-100">Add Question</Button>
                </div>

                {/* Question List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {questions.map((q, index) => (
                    <div key={index} className="p-4 bg-white shadow rounded-lg">
                      <h3 className="font-bold text-lg">{q.title}</h3>
                      <p className="text-sm text-gray-600">{q.answer}</p>
                      <span className="text-xs text-blue-500">Tags: {q.tags}</span>
                    </div>
                  ))}
                </div>
              </>
            } />

            <Route path="/categories" element={<Categories />} />
            <Route path="/bookmarked" element={<Bookmarked />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
        </div>

        {/* Add Question Modal */}
        <AddQuestionModal
          open={open}
          setOpen={setOpen}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          addQuestion={addQuestion}
        />
      </div>
    </Router>
  );
}
