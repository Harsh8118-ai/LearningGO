import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { AddQuestionModal } from "../../components/AddQuestionModal";
import { FaSearch, FaPlus } from "react-icons/fa"; // Icons
import ToggleQues from "./Questions/ToggleQues";

export default function Questions() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", answer: "", tags: "" });

  useEffect(() => {
    AOS.init({ duration: 800 }); // Initialize AOS
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ title: "", answer: "", tags: "" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-950 text-white">
      
      {/* 🔍 Search Bar */}
      <div className="w-full max-w-2xl flex items-center bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 shadow-md mb-6">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search questions..."
          className="bg-transparent flex-1 px-2 py-1 text-white focus:outline-none"
        />
      </div>

      {/* ➕ Add Question Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="gradient text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300"
      >
        <FaPlus /> Add Question
      </motion.button>

      {/* 📝 Question List */}
      <div className="w-full max-w-4xl mt-6">
        <ToggleQues />
      </div>

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
