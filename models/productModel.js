const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: [true, "Product must be unique"],
      minlength: [3, "To short Product title"],
      maxlength: [200, "To long Product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "description required"],
      minlength: [10, "Too short description name"],
      maxlength: [5000, "Too long description name"], // maxlength for String
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true, // Trim removes whitespace characters from the beginning and end of a String
      max: [200000, "Too long product price"], // max for Number
      min: [0.1, "Price must be greater than 0 "],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String], //Array of colors
    imageCover: {
      type: String,
      required: [true, "Cover image is required"],
    },
    images: [String], // Array of images
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to parent category"],
    },
    subCategories: [
      // product may be belonging to multiple categories [Array]
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
        // required: [true, "Product must be belong to parent subCategory"],
      },
    ],
    brind: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      // required: [true, "Product must be belong to parent prind"],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be greater than or qeual 1"],
      max: [5, "Rating must be less than or qeual 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    // select: "name -_id",    // if u want remove id [just return name of category]
    select: "name",
  });
  next();
});
module.exports = mongoose.model("Product", productSchema);
