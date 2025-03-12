import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import { useAuth } from "../store/UseAuth"; // Import authentication hook

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function QuestionList() {
  const { user } = useAuth(); // Get authenticated user
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    const fetchQuestions = async () => {
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
        

        // 🔹 Extracting the `questions` array properly
        setQuestions(data.questions || []); // Ensure it's an array, even if empty
      } catch (error) {
        
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Your Questions
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading questions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : questions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, index) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-5 bg-white shadow-lg rounded-lg border border-gray-300"
            >
              <h3 className="font-bold text-lg text-blue-700">{q.question}</h3>
              <p className="text-gray-600 mt-2">{q.answer}</p>
              <div className="text-sm text-gray-500 mt-2">
                Tags: {q.tags.length > 0 ? q.tags.join(", ") : "No tags"}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Created At: {new Date(q.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <FaQuestionCircle size={50} className="text-gray-400" />
          <p className="text-gray-600 mt-2">
            No questions added yet. Start by adding one!
          </p>
        </div>
      )}
    </div>
  );
}
