import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useAuth } from "../../store/UseAuth";
import { QuestionModal } from "../QuestionModal";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const PublicQues = () => {
  const { user } = useAuth();
  const [PublicQuestions, setPublicQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

    const fetchPublicQuestions = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await fetch(`${BASE_URL}/ques/public`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch public questions");
        }

        const data = await response.json();
        console.log("Fetched public questions:", data);
        

        if (data.length === 0) {
          setPublicQuestions([{ _id: "1", question: "Test Question", likes: 0, username: "Admin", createdAt: new Date(), answers: [] }]);
        } else {
          setPublicQuestions(data);
          fetchAnswersCount(data);
        }
      } catch (error) {
        console.error("Error fetching public questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    if (user) {
      console.log("User is authenticated:", user);  // Log the user object
      fetchPublicQuestions();
    } else {
      console.log("User is not authenticated.");
      setLoading(false); // Stop loading if no user
    }
  }, [user]);


  const likeQuestion = async (questionId, isLiked) => {
    if (!user) return alert("Please log in to like questions");

    // Optimistically update the UI
    setPublicQuestions((prev) =>
      prev.map((q) => {
        if (q._id === questionId) {
          // Update likes count
          const currentLikesCount = typeof q.likes === 'number' ? q.likes : 0;
          const newLikesCount = isLiked ? Math.max(0, currentLikesCount - 1) : currentLikesCount + 1;

          // Update likedByUser array
          let newLikedByUser = Array.isArray(q.likedByUser) ? [...q.likedByUser] : [];
          if (isLiked) {
            newLikedByUser = newLikedByUser.filter(id => id !== user._id);
          } else if (!newLikedByUser.includes(user._id)) {
            newLikedByUser.push(user._id);
          }

          return {
            ...q,
            likes: newLikesCount,
            likedByUser: newLikedByUser
          };
        }
        return q;
      })
    );

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/ques/${questionId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) throw new Error("Failed to like/unlike question");

      const data = await response.json();
      console.log("Updated likes:", data);

      // Update with server response data
      setPublicQuestions((prev) =>
        prev.map((q) => {
          if (q._id === questionId) {
            // Make sure we're using the likes count from the server
            const likesFromServer = typeof data.likes === 'number' ? data.likes : 0;

            // Keep track of liked status for this user
            const updatedLikedByUser = isLiked
              ? (Array.isArray(q.likedByUser) ? q.likedByUser.filter(id => id !== user._id) : [])
              : (Array.isArray(q.likedByUser) ? [...q.likedByUser, user._id] : [user._id]);

            return {
              ...q,
              likes: likesFromServer,
              likedByUser: updatedLikedByUser
            };
          }
          return q;
        })
      );
    } catch (error) {
      console.error("Error liking/unliking question:", error);

      // Revert optimistic update in case of error
      fetchPublicQuestions(); // Refresh the data from server
    }
  };

  const fetchAnswersCount = async (questions) => {
    try {
      const updatedQuestions = await Promise.all(
        questions.map(async (q) => {
          const answerResponse = await fetch(`${BASE_URL}/ques/${q._id}/answer`);
          const answerData = await answerResponse.json();
          return { ...q, answers: answerData.answers?.length || 0 };
        })
      );
  
      setPublicQuestions(updatedQuestions); // Update state with correct answer counts
    } catch (error) {
      console.error("Error fetching answers count:", error);
    }
  };
  


  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4 py-4">
      {PublicQuestions?.length > 0 ? (
        PublicQuestions.map((q, index) => {
          const isLiked = user && Array.isArray(q.likedByUser) && q.likedByUser.includes(user._id);

          return (
            <QuestionCard
              key={`${q._id}-${index}`}
              title={q.question}
              author={q.username}
              time={new Date(q.createdAt).toLocaleDateString()}
              answers={q.answers || 0}
              likes={typeof q.likes === 'number' ? q.likes : 0}
              tags={q.tags || "General"}
              tagColor={"purple"}
              isLiked={isLiked}
              onLike={() => likeQuestion(q._id, isLiked)}
              onAnswer={() => setSelectedQuestion(q)}
            />
          );
        })
      ) : (
        <p className="text-gray-400">No public questions available.</p>
      )}

      {/* Question Modal */}
      {selectedQuestion && (
        <QuestionModal
        open={selectedQuestion !== null}
        setOpen={(value) => {
          if (!value) setSelectedQuestion(null);
        }}
        question={selectedQuestion}
      />
      
      )}
    </div>
  );
};

export default PublicQues;

