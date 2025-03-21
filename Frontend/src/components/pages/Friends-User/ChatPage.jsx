import { useParams } from "react-router-dom";
import Chat from "./Chat"; // Import Chat Component

const ChatPage = () => {
  const { friendId } = useParams(); // Get friendId from URL

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Chat with {friendId}</h2>
      <Chat receiverId={friendId} />
    </div>
  );
};

export default ChatPage;
