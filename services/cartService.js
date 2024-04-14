const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const calculateTotalCartPrice = (cart) => {
  // calculate total cart price
  // cart.totalPrice = cart.cartItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};
// @desc    add product to Cart
// @route   POST  /api/v1/cart
// @access  Private/Protected/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // calculate total cart price
  calculateTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    data: cart,
  });
});

// @desc    remove product from cart
// @route   DELETE  /api/v1/cart
// @access  Private/Protected/User
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.productId } },
    },
    { new: true }
  );
  calculateTotalCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    // data: cart,
  });
});

// @desc    remove all from cart
// @route   DELETE  /api/v1/cart
// @access  Private/Protected/User
exports.removeAllFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  calculateTotalCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "success",
    message: "Cart is clear",
  });
});

// @desc    Git logged user cart
// @route   GIT  /api/v1/cart
// @access  Private/Protected/User
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found for You!"));
  }
  res.status(200).json({
    status: "success",
    message: "My Cart",
    result: cart.cartItems.length,
    data: cart,
  });
});

// @desc    update logged user cart
// @route   PUT  /api/v1/cart
// @access  Private/Protected/User
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found for You!"));
  }
  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.productId
  );
  if (productIndex > -1) {
    const cartItem = cart.cartItems[productIndex];
    cartItem.quantity = quantity;
    cart.cartItems[productIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id ${req.params.productId}`, 404)
    );
  }
  calculateTotalCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "success",
    result: cart.cartItems.length,
    message: "Cart updated",
    data: cart,
  });
});

// @desc    applay coupon on user cart
// @route   PUT  /api/v1/cart
// @access  Private/Protected/User
// exports.applayCoupon = asyncHandler(async (req, res, next) => {
//   const coupon = await Coupon.findOne({
//     name: req.body.coupon,
//     expire: { $gt: Date.now() },
//   });
//   if (!coupon) {
//     return next(new ApiError("Invalid Coupon!"));
//   }
//   const cart = await Cart.findOne({ user: req.user._id });
//   const totalPrice = cart.totalCartPrice;

//   const discountPrice = (
//     totalPrice -
//     (totalPrice * coupon.discount) / 100
//   ).toFixed(2);
//   cart.totalPriceAfterDiscount = discountPrice;

//   await cart.save();
//   res.status(200).json({
//     status: "success",
//     result: cart.cartItems.length,
//     message: "Cart updated",
//     data: cart,
//   });
// });
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
