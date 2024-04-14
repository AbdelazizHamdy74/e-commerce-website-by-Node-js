const express = require("express");

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getCoupons)
  .post(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    createCoupon
  );
router
  .route("/:id")
  .get(getCoupon)
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    updateCoupon
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteCoupon
  );

module.exports = router;
