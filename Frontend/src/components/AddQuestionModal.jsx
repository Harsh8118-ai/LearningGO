import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch"; // Toggle for public/private
import { useAuth } from "../components/store/UseAuth"; // Import authentication hook

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function AddQuestionModal({ open, setOpen, newQuestion, setNewQuestion }) {
  const { user } = useAuth(); // Get user data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Default to public

  const addQuestion = async () => {
    if (!newQuestion.title.trim() ) {
      setError("Question title and answer cannot be empty!");
      return;
    }
  
    if (!user?._id) {
      setError("User is not authenticated!");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(`${BASE_URL}/ques`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,  // Ensure correct userId is sent
          username: user.username || "Anonymous",
          questions: [
            {
              question: newQuestion.title.trim(),
              answer: newQuestion.answer.trim(),
              tags: newQuestion.tags
                ? newQuestion.tags.split(",").map(tag => tag.trim())
                : [],
              isPublic: isPublic, // Public/private setting
            },
          ],
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
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md md:max-w-lg w-full p-6 rounded-lg shadow-lg bg-gray-950 text-white">
        
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
            className="bg-gray-800 text-white border-gray-600"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          />
          <Textarea
            placeholder="Your Answer"
            className="bg-gray-800 text-white border-gray-600"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          />
          <Input
            placeholder="Tags (comma separated)"
            className="bg-gray-800 text-white border-gray-600"
            value={newQuestion.tags}
            onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
          />

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between mt-2">
            <span>Make Public</span>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </motion.div>

        {/* ⚠️ Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* 🖱️ Animated Save Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mt-4"
        >
          <Button 
            onClick={addQuestion} 
            className="w-full bg-[#4CAF50] text-white transition-all duration-300"
            disabled={loading || !newQuestion.title.trim()}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
