import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useAuth } from "../../store/UseAuth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TrendingQues = () => {
    const { user } = useAuth();
    const [trendingQuestions, setTrendingQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingQuestions = async () => {
            try {
                const response = await fetch(`${BASE_URL}/ques/trending`);
                if (!response.ok) {
                    throw new Error("Failed to fetch trending questions");
                }

                const data = await response.json();
                console.log("Fetched trending questions:", data);

                // Ensure each question has the correct data structure
                const formattedData = Array.isArray(data) ? data.map(q => ({
                    ...q,
                    likes: typeof q.likes === 'number' ? q.likes : (
                        Array.isArray(q.likes) ? q.likes.length : 0
                    ),
                    likedByUser: Array.isArray(q.likedByUser) ? q.likedByUser : []
                })) : [];

                setTrendingQuestions(formattedData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching trending questions:", error);
                setError("Failed to load questions.");
                setLoading(false);
            }
        };

        fetchTrendingQuestions();
    }, []);

    const likeQuestion = async (questionId, isLiked) => {
        if (!user) return alert("Please log in to like questions");

        // Optimistically update the UI by toggling the like count
        setTrendingQuestions((prev) =>
            prev.map((q) =>
                q._id === questionId
                    ? { ...q, likes: isLiked ? q.likes - 1 : q.likes + 1 }
                    : q
            )
        );

        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${BASE_URL}/ques/${questionId}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user._id }), // ✅ Send userId
            });

            if (!response.ok) throw new Error("Failed to like/unlike question");

            const data = await response.json();
            console.log("Updated likes:", data.likes);

            // After receiving the response, update the like count with the actual data from the server
            setTrendingQuestions((prev) =>
                prev.map((q) =>
                    q._id === questionId ? { ...q, likes: data.likes } : q
                )
            );
        } catch (error) {
            console.error("Error liking/unliking question:", error);

            // In case of error, revert the optimistic update
            setTrendingQuestions((prev) =>
                prev.map((q) =>
                    q._id === questionId
                        ? { ...q, likes: isLiked ? q.likes + 1 : q.likes - 1 }
                        : q
                )
            );
        }
    };

    const handleAnswer = async (questionId) => {
        if (!user) return alert("Please log in to answer questions");

        const answerText = prompt("Enter your answer:");
        if (!answerText) return;

        try {
            const response = await fetch(`${BASE_URL}/ques/${questionId}/answer`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user._id, username: user.name, answer: answerText }),
            });

            if (!response.ok) throw new Error("Failed to post answer");

            const data = await response.json();

            setTrendingQuestions((prev) =>
                prev.map((q) => (q._id === questionId ? { ...q, answers: [...q.answers, data.answer] } : q))
            );

        } catch (error) {
            console.error("Error answering question:", error);
        }
    };

    if (loading) return <p className="text-gray-400">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4 py-4">
            {trendingQuestions?.length > 0 ? (
                trendingQuestions.map((q) => {
                    // Check if user has liked this question
                    const isLiked = user && Array.isArray(q.likedByUser) && q.likedByUser.includes(user._id);

                    return (
                        <QuestionCard
                            key={q._id}
                            title={q.question}
                            author={q.username}
                            time={new Date(q.createdAt).toLocaleDateString()}
                            answers={q.answers?.length || 0}
                            likes={typeof q.likes === 'number' ? q.likes : 0}
                            tags={q.tags || "General"}
                            tagColor={"purple"}
                            isLiked={isLiked} // Pass the liked status to QuestionCard
                            onLike={() => likeQuestion(q._id, isLiked)}
                            onAnswer={() => handleAnswer(q._id)}
                        />
                    );
                })
            ) : (
                <p className="text-gray-400">No trending questions available.</p>
            )}
        </div>
    );
};

export default TrendingQues;