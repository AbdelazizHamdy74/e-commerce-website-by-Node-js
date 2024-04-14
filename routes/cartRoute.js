const express = require("express");

const {
  addProductToCart,
  getCart,
  removeProductFromCart,
  removeAllFromCart,
  updateCartItem,
  applyCoupon,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(authService.protected, authService.allowedTo("user"), getCart)
  .post(authService.protected, authService.allowedTo("user"), addProductToCart)
  .delete(
    authService.protected,
    authService.allowedTo("user"),
    removeAllFromCart
  );
router.put(
  "/applyCoupon",
  authService.protected,
  authService.allowedTo("user"),
  applyCoupon
);
router
  .route("/:productId")
  .put(authService.protected, authService.allowedTo("user"), updateCartItem)
  .delete(
    authService.protected,
    authService.allowedTo("user"),
    removeProductFromCart
  );

module.exports = router;
