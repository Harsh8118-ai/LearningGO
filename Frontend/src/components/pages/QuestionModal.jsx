import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export function QuestionModal({ question, isOpen, onClose, onEdit, onDelete }) {
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswer, setEditedAnswer] = useState(question.answer);

  if (!isOpen) return null;
  if (!question) return null; // Prevent rendering if question is null

  const handleEdit = () => {
    onEdit({ ...question, question: editedQuestion, answer: editedAnswer });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Edit Question</h2>
          <button onClick={onClose}>
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Editable Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Question</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Answer</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Delete
          </button>
          <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
