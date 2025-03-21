import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Categories from "./components/pages/Categories";
import Bookmarked from "./components/pages/Bookmarked";
import Settings from "./components/pages/Settings";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import HomePage from "./HomePage";
import AuthSuccess from "./components/store/AuthSuccess";
import Friends from "./components/pages/Friends-User/Friends";
import FriendRequests from "./components/pages/Friends-User/FriendRequests";
import ChatPage from "./components/pages/Friends-User/ChatPage";

export default function App() {
  

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/bookmarked" element={<Bookmarked />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="/chat/:friendId" element={<ChatPage />} />

          </Routes>
        </div>

        </div>
    </Router>
  );
}
