import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const generateInviteCode = (userId) => {
    const last6Chars = userId.slice(-6);
    let numericCode = parseInt(last6Chars, 16) % 1000000;
    return `${numericCode.toString().padStart(6, "0")}`;
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        if (!["/", "/login", "/signup"].includes(location.pathname)) {
          navigate("/login");
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
            if (!["/", "/login", "/signup"].includes(location.pathname)) {
              navigate("/login");
            }
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.user || !data.user._id) {
          throw new Error("Invalid response: user ID not found");
        }

        const userInviteCode = data.user.inviteCode;
        setUser(data.user);
        setInviteCode(userInviteCode);
        localStorage.setItem("inviteCode", userInviteCode);

        // Fetch additional stats
        fetchUserQuestionStats(data.user._id);
        fetchUserAnswerStats(data.user._id);
      } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        if (!["/", "/login", "/signup"].includes(location.pathname)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);

  // Fetch network stats whenever user changes
  useEffect(() => {
    if (user) {
      const fetchNetworkStats = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const [friendsRes, sentRes, receivedRes] = await Promise.all([
            axios.get(`${BASE_URL}/friends/friends-list`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/friends/requests/sent`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/friends/requests/received`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setFriends(friendsRes.data.friends || []);
          setSentRequests(sentRes.data || []);
          setReceivedRequests(receivedRes.data || []);
        } catch (err) {
          console.error("Network stats error:", err.message);
          setFriends([]);
          setSentRequests([]);
          setReceivedRequests([]);
        }
      };

      fetchNetworkStats();
    }
  }, [user]);

  const fetchUserQuestionStats = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/ques/user/${userId}`, {
        params: { viewerId: userId },
      });

      const userQuestions = response.data.questions || [];
      setQuestionsCount(userQuestions.length);
    } catch (error) {
      console.error("Error fetching user questions:", error.message);
      setQuestionsCount(0);
    }
  };

  const fetchUserAnswerStats = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/ques/answers/user/${userId}`);
      const userAnswers = response.data.answers || [];
      setAnswersCount(userAnswers.length);
    } catch (error) {
      console.error("Error fetching user answers:", error.message);
      setAnswersCount(0);
    }
  };

  return {
    user,
    inviteCode,
    loading,
    questionsCount,
    answersCount,
    friends,
    sentRequests,
    receivedRequests,
    friendsCount: friends.length,
    receivedRequestsCount: receivedRequests.length,
    sentRequestsCount: sentRequests.length,
  };
}
