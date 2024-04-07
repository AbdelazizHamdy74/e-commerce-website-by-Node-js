const express = require("express");

const {
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protected,
    authService.allowedTo("user"),
    addProductToWishlist
  );
router
  .route("/:productId")
  .delete(
    authService.protected,
    authService.allowedTo("user"),
    removeProductFromWishlist
  );

module.exports = router;
