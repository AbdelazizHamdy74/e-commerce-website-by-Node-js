const mongoose = require("mongoose");
const { bool } = require("sharp");
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
    // orderStatus: {
    //   type: String,
    //   enum: ["Pending", "Shipped", "Delivered"],
    //   default: "Pending",
    // },
    orderStatus: {
      type: Boolean,
      default: false,
    },
    deliveredAt: { type: Date },
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

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImage" }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next();
});
module.exports = mongoose.model("Order", orderSchema);
