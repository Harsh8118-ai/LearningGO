const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inviteCode: { type: String, required: true, unique: true },
  friends: [{ userId: mongoose.Schema.Types.ObjectId, inviteCode: String }], 
  friendRequests: [{ userId: mongoose.Schema.Types.ObjectId, inviteCode: String }],
  requestsSent: [{ userId: mongoose.Schema.Types.ObjectId, inviteCode: String }],
});

const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
