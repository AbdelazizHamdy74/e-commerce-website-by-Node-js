const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);

// @desc    Create subCategory for specific category  [Nested route]
// @route   GET /api/v1/categories/:categoryId/subcategories
// @route EX  localhost:3000/api/v1/categories/65e9817874f47ce0e46706eb/subcategories?page=1
// @access  Private
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    Get list of subcategories for specific category [Nested route]
// Nested   route
// @route   GET /api/v1/categories/:categoryId/subcategories
// @route EX  localhost:3000/api/v1/categories/65e9817874f47ce0e46706eb/subcategories?page=1
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
