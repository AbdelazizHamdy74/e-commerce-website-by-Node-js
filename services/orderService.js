const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

// @desc    create cash order
// @route   POST  /api/v1/order/cratId
// @access  Private/Protected/User

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0,
    shippingPrice = 0;
  // get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found for You!"));
  }
  // get order price and check if have a coupon
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + shippingPrice + taxPrice;
  // create a new order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalOrderPrice,
  });
  // after the order has been created, decrement product amount and increment product sold quantity
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        upsert: true,
      },
    }));
    await Product.bulkWrite(bulkOptions);
    // delete cart items
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    success: true,
    data: order,
  });
});
