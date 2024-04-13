const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { Result } = require("express-validator");

// @desc    add address to adresses
// @route   POST  /api/v1/adress
// @access  Private/Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "address added successfully",
    data: user.addresses,
  });
});

// @desc    remove address
// @route   DELETE  /api/v1/address/:addressId
// @access  Private/Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "address remove successfully",
    data: user.addresses,
  });
});

// @desc    Git logged user addresses
// @route   GIT  /api/v1/address
// @access  Private/Protected/User

exports.getMyAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    message: "My addresses",
    result: user.addresses.length,
    data: user.addresses,
  });
});
