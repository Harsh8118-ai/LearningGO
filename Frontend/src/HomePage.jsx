import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { FaSearch, FaPlus } from "react-icons/fa"; // Icons
import { QuestionList } from "./components/pages/QuestionList";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", answer: "", tags: "" });
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 }); // Initialize AOS
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ title: "", answer: "", tags: "" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* 🌟 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          Welcome to Your Study Hub 📖
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Find, Save, and Organize all your Interview Questions in One Place!
        </p>
      </motion.div>

      {/* 🔍 Search & Add Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search Bar - Web */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-full md:w-1/2"
        >
          <Input placeholder="Search Questions..." className="w-full" />
        </motion.div>

        {/* 🔄 Expandable Search Bar - Mobile */}
        <div className="md:hidden flex items-center w-full justify-end">
          {showSearch ? (
            <motion.div
              initial={{ width: "40px" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden w-full"
            >
              <Input
                placeholder="Search..."
                className="px-4 py-2 w-full"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
              <FaSearch size={18} className="absolute right-3 text-gray-500" />
            </motion.div>
          ) : (
            <button className="p-2 text-gray-500" onClick={() => setShowSearch(true)}>
              <FaSearch size={20} />
            </button>
          )}
        </div>

        {/* ➕ Add Question Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Add Question
        </motion.button>
      </div>

      <QuestionList />

      {/* ➕ Add Question Modal */}
      <AddQuestionModal
        open={open}
        setOpen={setOpen}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        addQuestion={addQuestion}
      />
    </div>
  );
}
