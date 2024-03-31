const express = require("express");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/Validator/reviewValidator");

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  set_ProductId_UserId_ToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");

// mergeParams Allow u to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protected,
    authService.allowedTo("user"),
    set_ProductId_UserId_ToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protected,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
