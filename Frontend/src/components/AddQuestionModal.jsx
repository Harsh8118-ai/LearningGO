import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAuth } from "../components/store/UseAuth"; // Import the custom hook


// Access environment variable using import.meta.env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function AddQuestionModal({ open, setOpen, newQuestion, setNewQuestion }) {
  const { user } = useAuth(); // Get user & loading state
  const [loadingg, setLoadingg] = useState(false);
  const [error, setError] = useState("");


  const addQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.answer.trim()) {
      setError("Question title and answer cannot be empty!");
      return;
    }
  
    if (!user?._id) {
      setError("User is not authenticated!");
      return;
    }
  
    setLoadingg(true);
    setError("");
  
    try {
      const response = await fetch(`${BASE_URL}/ques-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id, // Ensure this is a valid ObjectId
          username: user.username || "Anonymous",
          question: newQuestion.title.trim(),
          answer: newQuestion.answer.trim(),
          tags: newQuestion.tags
            ? newQuestion.tags.split(",").map(tag => tag.trim())
            : [],
        }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add question");
      }

      window.location.reload(); 
  
      setNewQuestion({ title: "", answer: "", tags: "" });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingg(false);
    }
  };
  
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md md:max-w-lg w-full p-6 rounded-lg shadow-lg">
        
        {/* 🔥 Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Add New Question</DialogTitle>
          </DialogHeader>
        </motion.div>

        {/* 📝 Input Fields with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Question Title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          />
          <Textarea
            placeholder="Answer"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={newQuestion.tags}
            onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
          />
        </motion.div>

        {/* ⚠️ Error Message */}
        {error && <p className="text-[var(--text-color)] text-3xl mt-2">{error}</p>}

        {/* 🖱️ Animated Save Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mt-4"
        >
          <Button 
            onClick={addQuestion} 
            className="w-full bg-black text-white transition-all duration-300"
            disabled={loadingg || !newQuestion.title.trim() || !newQuestion.answer.trim()}
          >
            {loadingg ? "Saving..." : "Save"}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
