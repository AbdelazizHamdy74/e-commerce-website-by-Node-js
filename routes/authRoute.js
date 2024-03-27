const express = require("express");
const {
  registerValidator,
  loginValidator,
} = require("../utils/Validator/authValidator");

const {
  register,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.route("/register").post(registerValidator, register);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyPassword").post(verifyPasswordResetCode);
router.route("/resetPassword").put(resetPassword);

// router.post("/forgotPassword", forgotPassword);

module.exports = router;
