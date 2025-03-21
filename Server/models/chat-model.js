const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true }, // Unique chat ID for sender & receiver
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
