const User = require("../models/user-model");
const Friend = require("../models/friend-model");

// ✅ Send Friend Request using Invite Code
exports.sendFriendRequest = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const senderId = req.user.id; // Current logged-in user

    if (!inviteCode) return res.status(400).json({ message: "Invite code is required!" });

    // Find recipient by invite code
    const recipient = await User.findOne({ inviteCode });
    if (!recipient) return res.status(404).json({ message: "User not found!" });

    if (senderId === recipient._id.toString()) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
    }

    // Get or create sender's Friend document
    let senderFriend = await Friend.findOneAndUpdate(
      { userId: senderId },
      { $setOnInsert: { userId: senderId, friends: [], sentRequests: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    // Get or create recipient's Friend document
    let recipientFriend = await Friend.findOneAndUpdate(
      { userId: recipient._id },
      { $setOnInsert: { userId: recipient._id, friends: [], sentRequests: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    // Check if already friends
    if (senderFriend.friends.includes(recipient._id)) {
      return res.status(400).json({ message: "You are already friends!" });
    }

    // Check if request already exists
    if (senderFriend.sentRequests.includes(recipient._id)) {
      return res.status(400).json({ message: "Friend request already sent!" });
    }

    // Send friend request
    senderFriend.sentRequests.push(recipient._id);
    recipientFriend.friendRequests.push(senderId);
    
    await senderFriend.save();
    await recipientFriend.save();

    res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Accept or Reject Friend Request
exports.respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // requestId = user who sent the request
    const userId = req.user.id; // Current logged-in user

    let userFriend = await Friend.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, friends: [], sentRequests: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    let senderFriend = await Friend.findOneAndUpdate(
      { userId: requestId },
      { $setOnInsert: { userId: requestId, friends: [], sentRequests: [], friendRequests: [] } },
      { new: true, upsert: true }
    );

    // Check if request exists
    if (!userFriend.friendRequests.includes(requestId)) {
      return res.status(400).json({ message: "No friend request found!" });
    }

    if (action === "accept") {
      // Accept request
      userFriend.friends.push(requestId);
      senderFriend.friends.push(userId);
    }

    // Remove from friend requests and sent requests
    userFriend.friendRequests = userFriend.friendRequests.filter(id => id.toString() !== requestId);
    senderFriend.sentRequests = senderFriend.sentRequests.filter(id => id.toString() !== userId);

    await userFriend.save();
    await senderFriend.save();

    res.status(200).json({ message: `Friend request ${action}ed successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Get Friends List
exports.getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendData = await Friend.findOne({ userId }).populate("friends", "username email inviteCode");
    res.status(200).json(friendData?.friends || []);
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Get Sent Requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendData = await Friend.findOne({ userId }).populate("sentRequests", "username email inviteCode");
    res.status(200).json(friendData?.sentRequests || []);
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Get Received Requests
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendData = await Friend.findOne({ userId }).populate("friendRequests", "username email inviteCode");
    res.status(200).json(friendData?.friendRequests || []);
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};
