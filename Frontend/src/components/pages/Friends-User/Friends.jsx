import React from "react";
import { Link } from "react-router-dom";
import InviteCode from "./InviteCode";
import FindUser from "./FindUser";
import FriendList from "./FriendList";

export default function Friends() {
  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-screen bg-gray-100">
      {/* ✅ Card Container */}
      <div className="w-full sm:max-w-md gradient-bg
 shadow-lg rounded-lg p-6 space-y-4">
        {/* ✅ Invite Code Section */}
        <InviteCode />

        {/* ✅ Friend Requests Button */}
        <Link to="/friend-requests">
          <button className="w-full gradient
 text-white py-2 px-4 mt-3 rounded-md font-semibold shadow-md hover:brightness-90
 transition-all text-sm sm:text-base">
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
