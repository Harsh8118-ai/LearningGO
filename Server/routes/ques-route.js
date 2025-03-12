const express = require("express");
const router = express.Router();
const quesController = require("../controllers/ques-controllers");

// Create a new question under the same user
router.post("/", quesController.createQuestion);

// Get all users with their questions
router.get("/", quesController.getAllQuestions);

// Get all questions by a specific user
router.get("/:userId", quesController.getQuestionsByUserId);

// Update a specific question
router.put("/:userId/:questionId", quesController.updateQuestion);

// Delete a specific question
router.delete("/:userId/:questionId", quesController.deleteQuestion);

module.exports = router;
