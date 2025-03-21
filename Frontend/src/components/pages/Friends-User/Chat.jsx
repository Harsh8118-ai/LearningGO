import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";

const Chat = ({ receiverId }) => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [socket, setSocket] = useState(null);
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    // Initialize Socket.io connection
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        
        return () => newSocket.disconnect(); // ✅ Ensure proper cleanup
    }, []);

    // Listen for messages
    useEffect(() => {
        if (!userId || !socket) return;

        socket.emit("join", userId);

        const handleMessageReceived = (data) => {
            setChat((prev) => [...prev, data]);
        };

        socket.on("messageReceived", handleMessageReceived);

        return () => socket.off("messageReceived", handleMessageReceived); // ✅ Clean up listener
    }, [userId, socket]);

    // Fetch conversation from backend
    useEffect(() => {
        if (!userId || !receiverId) return;

        axios.get(`http://localhost:5000/api/chat/conversation/${userId}/${receiverId}`)
            .then(res => setChat(res.data))
            .catch(err => console.error("Error fetching messages:", err));
    }, [userId, receiverId]);

    // Send Message
    const sendMessage = () => {
        if (message.trim() && receiverId && socket) {
            const newMessage = { senderId: userId, receiverId, message };

            setChat((prev) => [...prev, newMessage]); // ✅ Optimistic update

            socket.emit("sendMessage", newMessage);

            axios.post("http://localhost:5000/api/chat/send", newMessage)
                .then(res => console.log("✅ Message saved:", res.data))
                .catch(err => console.error("❌ Error sending message:", err));

            setMessage(""); 
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg p-3 rounded-xl text-center text-xl font-semibold">
                {receiverId}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chat.map((msg, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-2 max-w-xs rounded-lg shadow-md text-white ${msg.sender === username ? "bg-blue-500 self-end" : "bg-gray-500 self-start"}`}
                    >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-gray-200 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </motion.div>
                ))}
            </div>
            <div className="flex items-center p-2 bg-white rounded-xl shadow-lg mt-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 rounded-lg border focus:outline-none"
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
