import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAuth } from "../store/UseAuth"; // Import authentication hook

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function QuestionList() {
  const { user } = useAuth(); // Get authenticated user
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedQuestion, setUpdatedQuestion] = useState({
    question: "",
    answer: "",
    tags: "",
  });

  // ✅ Define fetchQuestions separately to use it in multiple places
  const fetchQuestions = useCallback(async () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/ques-post/${user._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      setError("There is no Question Added. Please add a question.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ Use useEffect to fetch questions initially
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Open modal when clicking on a question
  const openQuestionModal = (q) => {
    setSelectedQuestion(q);
    setUpdatedQuestion({
      question: q.question,
      answer: q.answer,
      tags: q.tags.join(", "),
    });
    setEditMode(false);
  };

  // ✅ Handle updating a question
  const handleUpdate = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch(`${BASE_URL}/ques-post/${user._id}/${selectedQuestion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: updatedQuestion.question,
          answer: updatedQuestion.answer,
          tags: updatedQuestion.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      console.log("Question updated successfully");
      setEditMode(false);
      setSelectedQuestion(null);
      fetchQuestions(); // ✅ Refresh questions
    } catch (error) {
      console.error("Error updating question:", error.message);
    }
  };

  // ✅ Handle deleting a question
  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch(`${BASE_URL}/ques-post/${user._id}/${selectedQuestion._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      console.log("Question deleted successfully");
      setSelectedQuestion(null);
      fetchQuestions(); // ✅ Refresh questions
    } catch (error) {
      console.error("Error deleting question:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center text-[var(--text-color)] mb-6">Your Questions</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading questions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : questions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, index) => (
            <motion.div
              key={q._id}
              onClick={() => openQuestionModal(q)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-5 gradient-bg
 shadow-lg rounded-lg border border-gray-300 cursor-pointer hover:shadow-xl transition-all"
            >
              <h3 className="font-bold text-lg text-[var(--text-color)]">{q.question}</h3>
              <p className="text-gray-600 mt-2">{q.answer}</p>
              <div className="text-sm text-gray-500 mt-2">
                Tags: {q.tags.length > 0 ? q.tags.join(", ") : "No tags"}
              </div>
              <p className="text-xs text-gray-400 mt-1">Created At: {new Date(q.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <FaQuestionCircle size={50} className="text-gray-400" />
          <p className="text-gray-600 mt-2">No questions added yet. Start by adding one!</p>
        </div>
      )}

      {/* Question Modal */}
      {selectedQuestion && (
        <Dialog open={true} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogContent className="max-w-md md:max-w-lg w-full p-6 rounded-lg shadow-lg">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">{editMode ? "Edit Question" : "Question Details"}</DialogTitle>
              </DialogHeader>
            </motion.div>

            {/* Edit Mode */}
            {editMode ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-col gap-4">
                <Input placeholder="Question Title" value={updatedQuestion.question} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, question: e.target.value })} />
                <Textarea placeholder="Answer" value={updatedQuestion.answer} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, answer: e.target.value })} />
                <Input placeholder="Tags (comma separated)" value={updatedQuestion.tags} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, tags: e.target.value })} />
              </motion.div>
            ) : (
              <div className="text-gray-700">
                <h3 className="font-bold text-lg">{selectedQuestion.question}</h3>
                <p className="mt-2">{selectedQuestion.answer}</p>
                <p className="text-sm mt-2">Tags: {selectedQuestion.tags.length > 0 ? selectedQuestion.tags.join(", ") : "No tags"}</p>
                <p className="text-xs text-gray-500 mt-1">Created At: {new Date(selectedQuestion.createdAt).toLocaleString()}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              {editMode ? (
                <>
                  <Button onClick={handleUpdate} className="gradient
 hover:brightness-90
">Save</Button>
                  <Button onClick={() => setEditMode(false)} className="bg-gray-600 hover:bg-gray-700">Cancel</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditMode(true)} className="gradient-2
 hover:brightness-90
">Edit</Button>
                  <Button onClick={handleDelete} className="gradient-2
 hover:brightness-90
">Delete</Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
