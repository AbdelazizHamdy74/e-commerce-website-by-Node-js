const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImage } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

exports.uploadProductImages = uploadMixOfImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into u database
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into u database
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

// @desc    Create Product
// @route   POST  /api/v1/brands
// @access  Private
// check if the category & subCategory id is already exists or not >>>>>>> code in validator
exports.createProduct = factory.createOne(Product);

// @desc    Get list of Products
// @route   GET /api/v1/Products
// @access  Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc    Get specific Product by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getProduct = factory.getOne(Product);

// @desc    Update specific Product
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific Product
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
