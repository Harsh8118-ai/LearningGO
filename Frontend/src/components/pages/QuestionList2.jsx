import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QuestionModal } from "./QuestionModal";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "../store/UseAuth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function QuestionList2() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  const fetchQuestions = async () => {
    let endpoint = "/ques/trending";
    if (selectedCategory === "public") endpoint = "/ques/public";
    if (selectedCategory === "private") endpoint = `/ques/private/${user?._id}`;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleLike = async (questionId) => {
    try {
      await fetch(`${BASE_URL}/ques/like/${questionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await fetch(`${BASE_URL}/ques/delete/${questionId}`, { method: "DELETE" });
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="bg-black rounded-lg p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-xl font-medium">How do I implement authentication in Next.js?</h2>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                A
              </div>
              <span className="text-gray-400 text-sm ml-2">Alex Johnson</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">• 2 hours ago</span>
          </div>
        </div>
        <div className="bg-purple-900 text-purple-400 px-3 py-1 rounded-md text-sm font-medium">
          Web Development
        </div>
      </div>
      <div className="flex items-center text-gray-400 text-sm">
        <div className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>12 answers</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>34 likes</span>
        </div>
        <div className="ml-auto">
          <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
