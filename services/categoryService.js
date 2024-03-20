const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImages } = require("../middlewares/uploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

// @desc Upload image for category
exports.uploadImages = uploadSingleImages("image");

// midelwire to resize the image [Image processing]
exports.resizeImage = asyncHandler(async function (req, res, next) {
  const fileNmae = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(700, 700)
    .toFormat("jpeg")
    // .jpeg({ quality: 85 })
    .toFile(`./uploads/categories/ ${fileNmae}`);

  //Save the image into the database
  req.body.image = fileNmae;
  next();
});

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
