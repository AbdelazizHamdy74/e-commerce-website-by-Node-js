const express = require("express");
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/Validator/productValidator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const authService = require("../services/authService");
const reviewRoute = require("./reviewRoute");
const router = express.Router();

//nested route
router.use("/:productId/review", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
