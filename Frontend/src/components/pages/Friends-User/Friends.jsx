import React from "react";
import { Link } from "react-router-dom";
import InviteCode from "./InviteCode";
import FindUser from "./FindUser";
import FriendList from "./FriendList";

export default function Friends() {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      {/* ✅ Card Container */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg  p-6 space-y-4">
        {/* ✅ Invite Code Section */}
        <InviteCode />

        {/* ✅ Friend Requests Button */}
        <Link to="/friend-requests">
          <button className="w-full bg-blue-500 text-white py-2 my-3 px-4 rounded-md font-semibold shadow-md hover:bg-blue-600 transition-all">
            Friend Requests
          </button>
        </Link>

        {/* ✅ Find User Input */}
        <FindUser />

        {/* ✅ Friend List */}
        <FriendList />
      </div>
    </div>
  );
}
