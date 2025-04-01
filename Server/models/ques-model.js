const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String },
    tags: { type: [String], default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] }, // Change from number to array
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    answers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        answer: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


const userQuestionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    questions: [questionSchema], // 👈 Embedding questions array inside `questions`
  },
  { timestamps: true }
);

const Question = model("Question", userQuestionSchema);

module.exports = Question;
