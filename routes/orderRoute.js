const express = require("express");

const { createCashOrder } = require("../services/orderService");

const authService = require("../services/authService");
const router = express.Router();

router
  .route("/:cartId")
  .post(authService.protected, authService.allowedTo("user"), createCashOrder);
// router
//   .route("/:id")
//   .get(getProductValidator, getProduct)
//   .put(
//     authService.protected,
//     authService.allowedTo("admin", "suberAdmin"),
//     uploadProductImages,
//     resizeProductImages,
//     updateProductValidator,
//     updateProduct
//   )
//   .delete(
//     authService.protected,
//     authService.allowedTo("admin", "suberAdmin"),
//     deleteProductValidator,
//     deleteProduct
//   );
module.exports = router;
