import React, { useEffect, useState } from "react";
import axios from "axios";
import MyQuestionCard from "./MyQuestionCard";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


const MyQues = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions from the backend
  const fetchQuestions = async () => {
    if (!userId) {
      console.error("User ID is undefined, cannot fetch questions.");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/ques/user/${userId}`, {
        params: { viewerId: userId }, // Pass viewerId in the request
      });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Edit a question
  const handleEdit = async (questionId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/ques/${userId}/${questionId}`, updatedData);
      fetchQuestions(); // Refresh list
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  // Delete a question
  const handleDelete = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/ques/${userId}/${questionId}`);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Like a question
  const handleLike = async (questionId) => {
    try {
      await axios.post(`http://localhost:5000/api/ques/${questionId}/like`, { userId });
      fetchQuestions();
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (questionId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/ques/${userId}/${questionId}/toggle-visibility`);
      fetchQuestions();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="space-y-4 py-4">
      {questions.length === 0 ? (
        <p>No questions posted yet.</p>
      ) : (
        questions.map((question) => (
          <MyQuestionCard
            key={question._id}
            title={question.question}
            author="You"
            time={new Date(question.createdAt).toLocaleDateString()}
            answers={question.answers.length}
            likes={question.likes.length}
            tag={question.tags?.[0] || "General"}
            tagColor="purple"
            isPublic={question.isPublic}
            onEdit={(updatedData) => handleEdit(question._id, updatedData)}
            onToggleVisibility={() => handleToggleVisibility(question._id, question.isPublic)}
            onDelete={() => handleDelete(question._id)}
            onLike={() => handleLike(question._id)}
          />
        ))
      )}
    </div>
  );
};

export default MyQues;
