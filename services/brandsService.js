const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandsModel");
const factory = require("./handlersFactory");
const { uploadSingleImages } = require("../middlewares/uploadImageMiddleware");

// @desc Upload image for brand
exports.uploadImages = uploadSingleImages("image");

// midelwire to resize the image [Image processing]
exports.resizeImage = asyncHandler(async function (req, res, next) {
  const fileNmae = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(700, 700)
    .toFormat("jpeg")
    // .jpeg({ quality: 85 })
    .toFile(`./uploads/brands/ ${fileNmae}`);

  //Save the image into the database
  req.body.image = fileNmae;
  next();
});
// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
