const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

// @desc    Create Review
// @route   POST  /api/v1/Reviews
// @access  Private/Protected/User
exports.createReview = factory.createOne(Review);

// @desc    Get list of Reviews
// @route   GET /api/v1/Reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific Review by id
// @route   GET /api/v1/Review/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Update specific Review
// @route   PUT /api/v1/Review/:id
// @access  Private/Protected/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific Review
// @route   DELETE /api/v1/Review/:id
// @access  Private/Producted/user-admin-suberAdmin
exports.deleteReview = factory.deleteOne(Review);
