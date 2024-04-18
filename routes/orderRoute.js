const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterObjectForLoggedUser,
  updateOrderDelivered,
  updateOrderPaid,
  checkoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");
const router = express.Router();
router.get(
  "/sheckout-session/:cartId",
  authService.protected,
  authService.allowedTo("user"),
  checkoutSession
);
router
  .route("/:cartId")
  .post(authService.protected, authService.allowedTo("user"), createCashOrder);
router.route("/").get(
  authService.protected,
  // authService.allowedTo("user", "admin", "superadmin"),
  filterObjectForLoggedUser,
  getAllOrders
);
router
  .route("/:id")
  .get(authService.protected, authService.allowedTo("user"), getSpecificOrder);
router
  .route("/:id/pay")
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    updateOrderPaid
  );
router
  .route("/:id/delivered")
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    updateOrderDelivered
  );
//   .delete(
//     authService.protected,
//     authService.allowedTo("admin", "suberAdmin"),
//     deleteProductValidator,
//     deleteProduct
//   );
module.exports = router;
