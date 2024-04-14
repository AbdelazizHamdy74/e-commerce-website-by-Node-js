const Coupon = require("../models/couponModel");
const factory = require("./handlersFactory");

// @desc    Create Coupon
// @route   POST  /api/v1/Coupon
// @access  Private/admin | suberAdmin
exports.createCoupon = factory.createOne(Coupon);

// @desc    Get list of coupons
// @route   GET /api/v1/coupon
// @access  Public
exports.getCoupons = factory.getAll(Coupon);

// @desc    Get specific Coupon by id
// @route   GET /api/v1/Coupon/:id
// @access  Public
exports.getCoupon = factory.getOne(Coupon);

// @desc    Update specific Coupon
// @route   PUT /api/v1/Coupon/:id
// @access  Private
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete specific Coupon
// @route   DELETE /api/v1/Coupon/:id
// @access  Private
exports.deleteCoupon = factory.deleteOne(Coupon);
