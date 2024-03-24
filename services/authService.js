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

////////////////////////////////
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

///////////////////////////////
exports.protected = asyncHandler(async (req, res, next) => {
  // check if the token is existing
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new ApiError("No token provided", 401));
  }
  // verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  //check if the user exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("User dose not longer exist", 401));
  }
  //check if user change password after token create
  if (user.passwordChangeAt) {
    const passwordChangeTimeStamp = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passwordChangeTimeStamp > decoded.iat) {
      return next(
        new ApiError("Your password is changed, Please login agin", 401)
      );
    }
  }
  req.user = user;
  next();
});
