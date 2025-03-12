const express = require("express");
const router = express.Router();
const contactForm = require("../controllers/contact-controller");
const reviewForm = require("../controllers/review-controllers");
const Review = require("../models/review-model"); // Import the Review model

// POST route to add a new review
router.route("/review").post(reviewForm);

// GET route to fetch all reviews
router.get("/review", async (req, res) => {
  try {
    const reviews = await Review.find();
    console.log("Fetched reviews:", reviews);
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

// GET route to fetch a single review by ID
router.get("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching review", error });
  }
});

// DELETE route to delete a review by ID
router.delete("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// PUT route to update a review by ID
router.put("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating review with ID:", id);
    console.log("Received data:", req.body);

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Error updating review", error });
  }
});


module.exports = router;