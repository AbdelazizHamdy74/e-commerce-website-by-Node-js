const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

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

/////
exports.filterObjectForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObject = { user: req.user._id };
  next();
});

// @desc    get all order
// @route   POST  /api/v1/order/
// @access  Private/Protected/User/ admin/ superadmin
exports.getAllOrders = factory.getAll(Order);

// @desc    get specific order
// @route   POST  /api/v1/order/id
// @access  Private/Protected/User/ admin/ superadmin
exports.getSpecificOrder = factory.getOne(Order);

// @desc    Update order Paid
// @route   POST  /api/v1/order/:id/pay
// @access  Private/Protected/ admin/ superadmin
exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found for You!"));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({
    success: true,
    data: updatedOrder,
  });
});

// @desc    Update order Delivered
// @route   POST  /api/v1/order/:id/delivered
// @access  Private/Protected/ admin/ superadmin
exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found for You!"));
  }
  order.orderStatus = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({
    success: true,
    data: updatedOrder,
  });
});

///Online payment

// @desc    get checkout session from stripe and send it as response
// @route   POST  /api/v1/order/sheckout-session/cartId
// @access  Private/Protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
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
  // create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  //send session to response
  res.status(201).json({
    success: true,
    data: session,
  });
});

exports.createOnlineOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};
// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout-session-completed") {
    // console.log("creat order here.......");
    createOnlineOrder(event.data.object);
  }
  res.status(200).send("Webhook received!");
});
