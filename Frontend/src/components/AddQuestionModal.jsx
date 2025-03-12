import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function AddQuestionModal({ open, setOpen, newQuestion, setNewQuestion, addQuestion }) {
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

        {/* 🖱️ Animated Save Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mt-4"
        >
          <Button 
            onClick={addQuestion} 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          >
            Save
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
