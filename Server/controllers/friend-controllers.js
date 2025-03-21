const User = require("../models/user-model");
const Friend = require("../models/friend-model");


// ✅ Send Friend Request using Invite Code
exports.sendFriendRequest = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const senderId = req.user.id;

    console.log("📌 Received Friend Request - Invite Code:", inviteCode);
    console.log("📌 Sender ID:", senderId);

    if (!inviteCode) {
      console.error("❌ Invite Code Missing!");
      return res.status(400).json({ message: "Invite code is required!" });
    }

    const recipientFriend = await Friend.findOne({ inviteCode }).populate("userId");

    if (!recipientFriend) {
      console.error("❌ User with invite code not found!");
      return res.status(404).json({ message: "User not found!" });
    }

    const recipient = recipientFriend.userId;
    console.log("📌 Recipient ID:", recipient._id.toString());

    if (senderId === recipient._id.toString()) {
      console.error("❌ Sender is trying to send request to themselves!");
      return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
    }

    let senderFriend = await Friend.findOneAndUpdate(
      { userId: senderId },
      { $setOnInsert: { userId: senderId, friends: [], requestsSent: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    let recipientFriendData = await Friend.findOneAndUpdate(
      { userId: recipient._id },
      { $setOnInsert: { userId: recipient._id, friends: [], requestsSent: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    console.log("📌 Sender Friend Data:", senderFriend);
    console.log("📌 Recipient Friend Data:", recipientFriendData);

    // ✅ Ensure requestsSent and friends exist
    if (!Array.isArray(senderFriend.requestsSent)) senderFriend.requestsSent = [];
    if (!Array.isArray(senderFriend.friends)) senderFriend.friends = [];
    if (!Array.isArray(recipientFriendData.friendRequests)) recipientFriendData.friendRequests = [];

    if (senderFriend.friends.some(friendId => friendId.toString() === recipient._id.toString())) {
      console.error("❌ Users are already friends!");
      return res.status(400).json({ message: "You are already friends!" });
    }

    if (senderFriend.requestsSent.some(_id => _id.toString() === recipient._id.toString())) {
      console.error("❌ Friend request already sent!");
      return res.status(400).json({ message: "Friend request already sent!" });
    }

    senderFriend.requestsSent.push(recipient._id);
    recipientFriendData.friendRequests.push(senderId);

    await senderFriend.save();
    await recipientFriendData.save();

    console.log("✅ Friend request sent successfully!");
    res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (error) {
    console.error("❌ Server Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};


// ✅ Accept or Reject Friend Request
exports.respondToFriendRequest = async (req, res) => {
  try {
    const { _id, receiverId, action } = req.body; // _id is the sender's userId

    if (!_id || !receiverId || !action) {
      return res.status(400).json({ message: "Missing senderId, receiverId, or action." });
    }

    console.log("📩 Processing request:", { senderId: _id, receiverId });

    // ✅ Find receiver's Friend document
    const receiver = await Friend.findOne({ userId: receiverId });
    if (!receiver) return res.status(404).json({ message: "Receiver not found!" });

    // ✅ Find sender's Friend document
    const sender = await Friend.findOne({ userId: _id });
    if (!sender) return res.status(404).json({ message: "Sender not found!" });

    // ✅ Ensure arrays exist
    receiver.friends = receiver.friends || [];
    sender.friends = sender.friends || [];
    receiver.friendRequests = receiver.friendRequests || [];
    sender.requestsSent = sender.requestsSent || [];

    if (action === "accept") {
      console.log("✅ Friend request accepted! Updating friend lists...");

      // ✅ Add sender to receiver's friend list (only if not already there)
      if (!receiver.friends.some(friend => friend.userId.equals(_id))) {
        receiver.friends.push({ userId: _id });
      }

      // ✅ Add receiver to sender's friend list (only if not already there)
      if (!sender.friends.some(friend => friend.userId.equals(receiverId))) {
        sender.friends.push({ userId: receiverId });
      }
    }

    // ✅ Remove friend request (Avoid undefined `req.userId` error)
    receiver.friendRequests = receiver.friendRequests.filter(req => req.userId && !req.userId.equals(_id));
    sender.requestsSent = sender.requestsSent.filter(req => req.userId && !req.userId.equals(receiverId));

    // ✅ Save both documents
    await receiver.save();
    await sender.save();

    console.log("✅ Friend request successfully processed.");
    return res.status(200).json({ message: `Friend request ${action}ed successfully!` });

  } catch (error) {
    console.error("❌ Error processing friend request:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};



// ✅ Get Friends List
exports.getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get the logged-in user's ID

    // 🔍 Find the Friend document for the user
    const friendData = await Friend.findOne({ userId });

    if (!friendData || friendData.friends.length === 0) {
      return res.status(200).json({ friends: [] }); // ✅ Return empty list if no friends
    }

    // ✅ Extract userIds from friends array
    const friendIds = friendData.friends.map(friend => friend.userId);

    // ✅ Fetch user details for each friend from the Users collection
    const friendsList = await User.find(
      { _id: { $in: friendIds } },
      "username email inviteCode"
    );

    res.status(200).json({ friends: friendsList }); // ✅ Return enriched friend data
  } catch (error) {
    console.error("❌ Error fetching friend list:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};




// ✅ Get Sent Requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID

    // ✅ Find the friend document for the user
    const friendData = await Friend.findOne({ userId });

    if (!friendData) {
      return res.status(404).json({ message: "Friend data not found" });
    }

    // ✅ Fetch user details for each sent request
    const sentRequests = await User.find(
      { _id: { $in: friendData.requestsSent } }, // Match IDs from `requestsSent`
      "username email inviteCode" // Select only required fields
    );

    res.status(200).json(sentRequests); // ✅ Return enriched data
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get Received Requests
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID

    // ✅ Find the friend document for the user
    const friendData = await Friend.findOne({ userId });

    if (!friendData) {
      return res.status(404).json({ message: "Friend data not found" });
    }

    // ✅ Fetch user details for each received request
    const receivedRequests = await User.find(
      { _id: { $in: friendData.friendRequests } }, // Match IDs from `friendRequests`
      "username email inviteCode" // Select only required fields
    );

    res.status(200).json(receivedRequests); // ✅ Return enriched data
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Withdraw Sent Friend Request
exports.withdrawFriendRequest = async (req, res) => {
  try {
    const { _id } = req.body; // ID of the recipient user
    const senderId = req.user.id; // Logged-in user's ID

    console.log("📌 Withdraw Friend Request - Sender ID:", senderId);
    console.log("📌 Recipient ID:", _id);

    if (!_id) {
      return res.status(400).json({ message: "Recipient ID is required!" });
    }

    // ✅ Find the friend document for the sender
    let senderFriend = await Friend.findOne({ userId: senderId });

    // ✅ Find the friend document for the recipient
    let recipientFriend = await Friend.findOne({ userId: _id });

    if (!senderFriend || !recipientFriend) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    // ✅ Check if the sender actually sent a request
    if (!senderFriend.requestsSent.some(request => request.userId.toString() === _id)) {
      console.error("❌ No sent friend request found!");
      return res.status(400).json({ message: "Friend request not found!" });
    }

    // ❌ Remove the request from `requestsSent` (Sender's side)
    senderFriend.requestsSent = senderFriend.requestsSent.filter(request => request.userId.toString() !== _id);

    // ❌ Remove the request from `friendRequests` (Recipient's side)
    recipientFriend.friendRequests = recipientFriend.friendRequests.filter(request => request.userId.toString() !== senderId);

    // ✅ Save the updates
    await senderFriend.save();
    await recipientFriend.save();

    console.log("✅ Friend request withdrawn successfully!");
    res.status(200).json({ message: "Friend request withdrawn successfully!" });

  } catch (error) {
    console.error("❌ Server Error in withdrawFriendRequest:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};
