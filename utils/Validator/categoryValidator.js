const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
exports.getCategoriyValedator = [
  check("id").isMongoId().withMessage(`invaled category id format`),
  validatorMiddleware, // Catches errors
];

exports.createCategoriyValedator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("name must be between 3 and 32 characters")
    // Make slug for category names
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoriyValedator = [
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("name must be between 3 and 32 characters"),
  // Make slug for category name
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoriyValedator = [
  check("id").isMongoId().withMessage(`invaled category id format or empty`),
  validatorMiddleware,
];
