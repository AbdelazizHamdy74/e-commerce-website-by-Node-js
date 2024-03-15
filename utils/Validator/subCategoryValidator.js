const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware, // to Catches errors
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between 2 and 32 characters")
    // make slug on name
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid Subcategory id format"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between 2 and 32 characters"),
  // make slug on name
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];
