const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
var bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const { uploadSingleImages } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

// @desc Upload image for brand
exports.uploadUserImage = uploadSingleImages("profileImage");

// midelwire to resize the image [Image processing]
exports.resizeImage = asyncHandler(async function (req, res, next) {
  const fileNmae = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(700, 700)
      .toFormat("jpeg")
      // .jpeg({ quality: 85 })
      .toFile(`./uploads/users/ ${fileNmae}`);

    //Save the image into the database
    req.body.profileImage = fileNmae;
  }
  next();
});

exports.createUser = factory.createOne(User);

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
// update all exept passwords
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
//update the password only
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 7),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteOne(User);

/////////////////////////////////////////////
exports.getMyData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  // first update the password
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 7),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // then generate new token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateMyData = asyncHandler(async (req, res, next) => {
  //update only email, name, and Phone number
  const user = await User.findByIdAndUpdate(
    req.user._id,

    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: user });
});

exports.deActiveMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "Acount delete Successfly" });
});

exports.activeMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: true },
    {
      new: true,
    }
  );
  res.status(200).json({ data: user });
});
