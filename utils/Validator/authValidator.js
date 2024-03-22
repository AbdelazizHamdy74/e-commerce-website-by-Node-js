const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
var bcrypt = require("bcryptjs");

const User = require("../../models/userModel");
exports.registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name required")
    .isLength({ min: 2 })
    .withMessage("Too short name")
    // make slug on name
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("phoneNumber").optional().isMobilePhone(["ar-EG", "ar-PS", "ar-SA"]),

  check("email")
    .notEmpty()
    .withMessage("Email is requires")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ minLength: 8 })
    .withMessage("Please enter password with at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password must be matches with confirm password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please enter password again"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("password is required"),
  validatorMiddleware,
];
