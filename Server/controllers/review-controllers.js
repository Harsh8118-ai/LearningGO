const review = require("../models/review-model");

const reviewForm = async (req, res) => {
  try {
    const { username, rating, comment, date, time } = req.body;

    // Validate the input
    if (!username || !rating || !comment || !date || !time ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new review entry
    await review.create({ username, rating, comment, date, time });

    // Respond with success
    return res.status(200).json({ message: "Review posted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Review not Posted" });
  }
};

module.exports = reviewForm;
