const Product = require("./productModel");

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
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  // this.populate({ path: "product", select: "title" });
  next();
});

//calculate the rating average and quantity
reviewSchema.statics.calculateRatingAverageAndQuantity = async function (
  productId
) {
  const statistics = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        rating: { $avg: "$rating" },
        quantity: { $sum: 1 },
      },
    },
  ]);
  if (statistics.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: statistics[0].rating,
      ratingsQuantity: statistics[0].quantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calculateRatingAverageAndQuantity(this.product);
});

reviewSchema.post("deleteOne", async function () {
  await this.constructor.calculateRatingAverageAndQuantity(this.product);
});

// 2- Create model
module.exports = mongoose.model("Review", reviewSchema);
