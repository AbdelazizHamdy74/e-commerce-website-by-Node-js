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

// @desc    Create review for specific product  [Nested route]
// @route   GET /api/v1/product/:productId/review
// @route EX  localhost:3000/api/v1/product/65e9817874f47ce0e46706eb/review?page=1
// @access  Private
exports.set_ProductId_UserId_ToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// @desc    Get list of reviews for specific product [Nested route]
// Nested   route
// @route   GET /api/v1/product/:productId/review
// @route EX  localhost:3000/api/v1/product/65e9817874f47ce0e46706eb/review?page=1
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
