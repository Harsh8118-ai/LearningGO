const {Schema, model, default: mongoose } = require('mongoose');

const reviewSchema = new Schema({

    username: {type: String, required: true},
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},

}, { timestamps: true });

const Review = new model("review", reviewSchema);

module.exports = Review;

