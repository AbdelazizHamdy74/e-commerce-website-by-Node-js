const Product = require("../models/productModel");
const factory = require("./handlersFactory");

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
