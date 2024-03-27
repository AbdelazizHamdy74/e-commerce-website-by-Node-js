const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validator/brandsValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadImages,
  resizeImage,
} = require("../services/brandsService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadImages,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadImages,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
