const Question = require("../models/ques-model");

// Create or Add a Question under the same User
const createQuestion = async (req, res) => {
  try {
    const { userId, username, question, answer, tags } = req.body;

    if (!userId || !username || !question || !answer) {
      return res.status(400).json({ message: "userId, username, question, and answer are required" });
    }

    // Find if the user already has a question document
    let userQuestions = await Question.findOne({ userId });

    if (!userQuestions) {
      // If no document exists for the user, create one
      userQuestions = new Question({
        userId,
        username,
        questions: [{ question, answer, tags: tags || [] }],
      });
    } else {
      // If document exists, push new question into the array
      userQuestions.questions.push({ question, answer, tags: tags || [] });
    }

    await userQuestions.save();

    return res.status(201).json({ message: "Question added successfully", userQuestions });
  } catch (error) {
    console.error("Error posting question:", error);
    return res.status(500).json({ message: "Error posting question", error: error.message });
  }
};

// Retrieve all users with their questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// Get all questions by a specific user
const getQuestionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userQuestions = await Question.findOne({ userId });

    if (!userQuestions) return res.status(404).json({ message: "No questions found for this user" });

    res.status(200).json(userQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// Update a specific question
const updateQuestion = async (req, res) => {
  try {
    const { userId, questionId } = req.params;
    const { question, answer, tags } = req.body;

    const userQuestions = await Question.findOne({ userId });
    if (!userQuestions) return res.status(404).json({ message: "User not found" });

    // Find the specific question in the array
    const questionToUpdate = userQuestions.questions.id(questionId);
    if (!questionToUpdate) return res.status(404).json({ message: "Question not found" });

    // Update fields
    if (question) questionToUpdate.question = question;
    if (answer) questionToUpdate.answer = answer;
    if (tags) questionToUpdate.tags = tags;

    await userQuestions.save();
    res.json({ message: "Question updated successfully", userQuestions });
  } catch (error) {
    console.error("Error updating question:", error.message);
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

// Delete a specific question
const deleteQuestion = async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    const userQuestions = await Question.findOne({ userId });
    if (!userQuestions) return res.status(404).json({ message: "User not found" });

    // Filter out the question to delete
    userQuestions.questions = userQuestions.questions.filter(q => q._id.toString() !== questionId);

    await userQuestions.save();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error.message);
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};

// Export all functions
module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionsByUserId,
  updateQuestion,
  deleteQuestion,
};
