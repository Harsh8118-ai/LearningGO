const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    username: { type: String, required: true }, // Match frontend user
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        tags: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Auto-generates `createdAt` and `updatedAt`
);

const Question = model("Question", questionSchema);

module.exports = Question;
