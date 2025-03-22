import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import Chat from "./Chat";

const ChatPage = () => {
    const { friendId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const friendUsername = location.state?.friendUsername || "Unknown";

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* ✅ Chat Header with Back Button */}
            <div className="bg-blue-500 text-white p-4 flex items-center shadow-md">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mr-3 p-2 rounded-full hover:bg-blue-600"
                >
                    <FaArrowLeft size={20} />
                </button>
                <FaUserCircle size={30} className="mr-2" />
                <h2 className="text-lg font-semibold">{friendUsername}</h2>
            </div>

            {/* ✅ Chat Component */}
            <div className="flex-1">
                <Chat receiverId={friendId} friendUsername={friendUsername} />
            </div>
        </div>
    );
};

export default ChatPage;
