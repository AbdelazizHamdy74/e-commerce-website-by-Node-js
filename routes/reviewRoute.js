const express = require("express");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/Validator/brandsValidator");

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(authService.protected, authService.allowedTo("user"), createReview);
router
  .route("/:id")
  .get(getReview)
  .put(authService.protected, authService.allowedTo("user"), updateReview)
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin", "user"),
    deleteReview
  );

module.exports = router;
