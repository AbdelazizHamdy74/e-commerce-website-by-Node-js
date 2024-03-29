const crypto = require("crypto");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

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

/////////////////////////////// be soure if user is logged
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

  //check if the user exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("User dose not longer exist", 401));
  }
  ///// check if the user active or not
  // if (!user.active) {
  //   return next(
  //     new ApiError(
  //       "Your account is not active please active your account first",
  //       401
  //     )
  //   );
  // }
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

// who can modify [User Permissison]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this resource", 403)
      );
    }
    next();
  });

//forgot Password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1 >> git user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User for this email not found", 404));
  }

  //2 >> generate random code and save it in the database
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(randomCode);
  // encrypt the random code
  const hashRandomCode = crypto
    .createHash("sha256")
    .update(randomCode)
    .digest("hex");

  //   //saved hash code [encrypt] in the database
  user.passwordResetCode = hashRandomCode;
  //add expiration date to the code
  user.passwordResetExpires = Date.now() + 10 * 60 * 100;
  user.passwordResetVerified = false;

  await user.save();

  //3 >> send reset code via email
  const message = `Hello ${user.name},\n\nThis is a confirmation that the password for your account
                   ${user.email} has just been changed.\n\nIf you did not make this request, please ignore
                   this email and your password will remain unchanged.\n\nYour password reset code is:
                   ${randomCode}\n\nRegards,\n${process.env.APP_NAME}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code valid for 10 minutes",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError(`there is error please try latter`, 500));
  }

  res.status(200).json({
    status: "success",
    message: "Password reset code has been sent to your email",
  });
});

//[verify code]
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ApiError("Password reset code is invalid or has expired", 400)
    );
  }
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset code has been verified",
  });
});

// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User for this email not found", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Password reset code is not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // if all ok then generate a new token
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password has been changed",
    token,
  });
});
