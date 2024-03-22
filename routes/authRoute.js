const express = require("express");
const {
  registerValidator,
  loginValidator,
} = require("../utils/Validator/authValidator");

const { register, login } = require("../services/authService");

const router = express.Router();

router.route("/register").post(registerValidator, register);
router.route("/login").get(loginValidator, login);

module.exports = router;
