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
  {
    timestamps: true,
    //to enable virtual
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// display the reviews on the product if you desplay it
productSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});
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
