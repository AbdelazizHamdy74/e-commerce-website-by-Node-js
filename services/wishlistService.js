const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc    add product to wishlist
// @route   POST  /api/v1/wishlist
// @access  Private/Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    data: user.wishlist,
  });
});

// @desc    remove product from wishlist
// @route   DELETE  /api/v1/wishlist
// @access  Private/Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    data: user.wishlist,
  });
});
