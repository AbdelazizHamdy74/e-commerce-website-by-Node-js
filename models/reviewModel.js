const mongoose = require("mongoose");
// 1- Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [3, "To short Review title"],
      maxlength: [2000, "To long Review title"],
    },
    rating: {
      type: Number,
      min: [1, "min rating value is 1"],
      max: [5, "max rating value is 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "login first to review"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product required"],
    },
  },
  { timestamps: true }
);

// 2- Create model
module.exports = mongoose.model("Review", reviewSchema);
