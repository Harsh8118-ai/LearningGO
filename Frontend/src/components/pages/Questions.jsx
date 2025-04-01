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
    <>
    <div className="bg-gray-950 mt-32">
       {/* ➕ Add Question Button */}
       <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          className="gradient
 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Add Question
        </motion.button>

        <ToggleQues />
        
      {/* ➕ Add Question Modal */}
      <AddQuestionModal
        open={open}
        setOpen={setOpen}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        addQuestion={addQuestion}
      />
    
    </div>
    </>
  );
}
