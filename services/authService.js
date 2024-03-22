var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  // Create a new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    // password: await bcrypt.hash(req.body.password, 7),
  });
  // generate the token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

////////////////////////////////
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid credentials", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid credentials", 401));
  }
  // generate the token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});
