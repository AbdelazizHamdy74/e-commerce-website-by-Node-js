const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        price: Number,
        color: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "login first "],
    },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number, default: 0 },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Credit Card", "Paypal"],
      default: "Cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: { type: Date },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
