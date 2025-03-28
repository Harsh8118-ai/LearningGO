import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../store/UseAuth"; // Authentication hook
import { FaUser, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function QuestionList2() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/ques-post/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      setError("No questions found. Please add one.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-3 border-b pb-2">
        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg">Recent Questions</button>
        <button className="px-4 py-2 text-gray-400">Trending Discussions</button>
        <button className="px-4 py-2 text-gray-400">Friend Activity</button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-6">Loading questions...</p>
      ) : error ? (
        <p className="text-center text-red-400 mt-6">{error}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {questions.map((q) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700"
            >
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaUser className="text-gray-500" />
                <span>{q.username || "Anonymous"}</span>
                <span className="text-gray-500">• {new Date(q.createdAt).toLocaleTimeString()}</span>
              </div>

              <h3 className="text-lg font-semibold text-white mt-2">{q.question}</h3>

              <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                <span className="flex items-center gap-1">
                  <FaCommentDots /> {q.comments?.length || 0} answers
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsUp /> {q.likes || 0} likes
                </span>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="bg-purple-700 text-white px-3 py-1 text-xs rounded-full">
                  {q.tags[0] || "General"}
                </span>
                <Button
                  onClick={() => navigate(`/question/${q._id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md"
                >
                  View
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
