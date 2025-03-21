// import { useEffect, useState } from "react";
// import axios from "axios";
// import InviteCode from "./InviteCode"; // ✅ Invite Code Component

// const Friends = () => {
//   const [searchTerm, setSearchTerm] = useState(""); // Search by username
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchCode, setSearchCode] = useState(""); // Search by invite code
//   const [friends, setFriends] = useState([]); // Friends list
//   const [sentRequests, setSentRequests] = useState([]); // Sent requests
//   const [receivedRequests, setReceivedRequests] = useState([]); // Received requests
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchFriends();
//     fetchSentRequests();
//     fetchReceivedRequests();
//   }, []);

//   // ✅ Fetch Friends
//   const fetchFriends = async () => {
//     try {
//       const res = await axios.get("/api/friends/friends");
//       setFriends(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching friends:", err);
//       setFriends([]);
//     }
//   };

//   // ✅ Fetch Sent Requests
//   const fetchSentRequests = async () => {
//     try {
//       const res = await axios.get("/api/friends/requests/sent");
//       setSentRequests(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching sent requests:", err);
//       setSentRequests([]);
//     }
//   };

//   // ✅ Fetch Received Requests
//   const fetchReceivedRequests = async () => {
//     try {
//       const res = await axios.get("/api/friends/requests/received");
//       setReceivedRequests(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching received requests:", err);
//       setReceivedRequests([]);
//     }
//   };

//   // ✅ Search Users by Username
//   const handleSearch = async () => {
//     if (!searchTerm.trim()) return;

//     try {
//       const response = await axios.get(`/api/users/search?query=${searchTerm}`);
//       setSearchResults(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error searching users:", error);
//       setSearchResults([]);
//     }
//   };

//   // ✅ Send Friend Request (By Username Search)
//   const sendFriendRequest = async (userId) => {
//     try {
//       await axios.post("/api/auth/friends/send-request", { userId });
//       alert("Friend request sent!");
//       setSearchResults([]); // Clear results after sending request
//       fetchSentRequests(); // Refresh sent requests
//     } catch (error) {
//       console.error("Error sending request:", error);
//       alert("Failed to send request.");
//     }
//   };

//   // ✅ Send Friend Request (By Invite Code)
//   const sendFriendRequestByCode = async () => {
//     if (!searchCode.trim()) {
//       setError("Invite code cannot be empty!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("/api/auth/friends/send-request", { inviteCode: searchCode });
//       setSearchCode("");
//       fetchSentRequests();
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Error sending request!");
//     }
//     setLoading(false);
//   };

//   // ✅ Accept or Reject Friend Request
//   const respondToRequest = async (requestId, action) => {
//     setLoading(true);
//     try {
//       await axios.post("/api/auth/friends/respond-request", { requestId, action });
//       fetchFriends();
//       fetchReceivedRequests();
//     } catch (err) {
//       console.error(`Error ${action}ing friend request:`, err);
//     }
//     setLoading(false);
//   };

//   // ✅ Handle Messaging a Friend (Replace with actual messaging logic)
//   const messageFriend = (friendId) => {
//     alert(`Messaging feature coming soon for friend: ${friendId}`);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Friends</h2>

//       {/* ✅ Invite Code Section */}
//       <InviteCode />

//       {/* ✅ Search Users by Username */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full p-2 border rounded-md"
//         />
//         <button
//           onClick={handleSearch}
//           className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//         >
//           Search
//         </button>
//       </div>

//       {/* ✅ Search Results */}
//       {searchResults.length > 0 && (
//         <div className="mt-4 p-4 border rounded-md">
//           <h3 className="text-lg font-semibold mb-2">Search Results</h3>
//           {searchResults.map((user) => (
//             <div key={user._id} className="flex justify-between items-center p-2 border-b">
//               <span>{user.username}</span>
//               <button
//                 onClick={() => sendFriendRequest(user._id)}
//                 className="bg-green-500 text-white px-3 py-1 rounded-md"
//               >
//                 Send Request
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ Search and Add Friends by Invite Code */}
//       <div className="mt-4">
//         <input
//           type="text"
//           value={searchCode}
//           onChange={(e) => setSearchCode(e.target.value)}
//           placeholder="Enter Invite Code"
//           className="w-full p-2 border rounded-md"
//         />
//         <button
//           onClick={sendFriendRequestByCode}
//           className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? "Sending..." : "Send Friend Request"}
//         </button>
//         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//       </div>

//       {/* ✅ Friends List */}
//       <h3 className="text-lg font-semibold mt-6">Your Friends</h3>
//       {friends.length > 0 ? (
//         friends.map((friend) => (
//           <div key={friend._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2">
//             <span className="text-gray-800 font-medium">{friend.username} ({friend.inviteCode})</span>
//             <button onClick={() => messageFriend(friend._id)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
//               Message
//             </button>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-600">No friends added yet.</p>
//       )}

//       {/* ✅ Sent Requests */}
//       <h3 className="text-lg font-semibold mt-6">Sent Friend Requests</h3>
//       {sentRequests.length > 0 ? (
//         sentRequests.map((request) => (
//           <div key={request._id} className="bg-gray-100 p-3 rounded-lg mb-2">
//             <span className="text-gray-800">{request.username} ({request.inviteCode})</span>
//             <span className="text-blue-500 ml-2">Pending</span>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-600">No sent requests.</p>
//       )}

//       {/* ✅ Received Requests */}
//       <h3 className="text-lg font-semibold mt-6">Friend Requests</h3>
//       {receivedRequests.length > 0 ? (
//         receivedRequests.map((request) => (
//           <div key={request._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2">
//             <span className="text-gray-800">{request.username} ({request.inviteCode})</span>
//             <div>
//               <button onClick={() => respondToRequest(request._id, "accept")} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2">
//                 Accept
//               </button>
//               <button onClick={() => respondToRequest(request._id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-600">No friend requests.</p>
//       )}
//     </div>
//   );
// };

// export default Friends;


import React from 'react'
import InviteCode from './InviteCode'
import FindUser from './FindUser'
import { Link } from 'react-router-dom'
import FriendList from './FriendList'

export default function Friends() {
  return (
    <>
    <InviteCode />
    <Link to="/friend-requests">
     <button>Freinds</button></Link>
    <FindUser />
    <FriendList />
    </>
  )
}
