import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = ({ receiverId }) => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [socket, setSocket] = useState(null);
    const userId = localStorage.getItem("userId");

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
        <div>
            <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>

            <div>
                {chat.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderId === userId ? "You" : msg.senderId}:</strong> {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Chat;
