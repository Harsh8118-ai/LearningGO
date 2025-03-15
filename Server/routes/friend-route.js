const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const User = require("../models/user-model");
const Friend = require("../models/friend-model");
const {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList,
  getSentRequests,
  getReceivedRequests,
} = require("../controllers/friend-controllers");

// ✅ Generate and Store Invite Code
router.post("/generate-invite-code", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Generate Invite Code
    const inviteCode = `LearningGo${userId}`;

    // Find or Create Friend Document
    let friendData = await Friend.findOne({ userId });
    if (!friendData) {
      friendData = new Friend({ userId, inviteCode });
    } else {
      friendData.inviteCode = inviteCode;
    }

    await friendData.save();

    res.status(200).json({ inviteCode, message: "Invite code generated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

// ✅ Get Stored Invite Code
router.get("/invite-code", authMiddleware, async (req, res) => {
  try {
    const friendData = await Friend.findOne({ userId: req.user.id });

    if (!friendData || !friendData.inviteCode) {
      return res.status(404).json({ message: "Invite code not generated yet!" });
    }

    res.status(200).json({ inviteCode: friendData.inviteCode });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

// ✅ Send a friend request using an invite code
router.post("/send-request", authMiddleware, sendFriendRequest);

// ✅ Accept or reject a friend request
router.post("/respond-request", authMiddleware, respondToFriendRequest);

// ✅ Get a list of friends
router.get("/friends", authMiddleware, getFriendsList);

// ✅ Get sent friend requests
router.get("/requests/sent", authMiddleware, getSentRequests);

// ✅ Get received friend requests
router.get("/requests/received", authMiddleware, getReceivedRequests);

module.exports = router;
