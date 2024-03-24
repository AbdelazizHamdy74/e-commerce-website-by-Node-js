const express = require("express");

const {
  getCategoriyValedator,
  updateCategoriyValedator,
  deleteCategoriyValedator,
  createCategoriyValedator,
} = require("../utils/Validator/categoryValidator");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImages,
  resizeImage,
} = require("../services/categoryService");

const AuthService = require("../services/authService");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    AuthService.protected,
    uploadImages,
    resizeImage,
    createCategoriyValedator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoriyValedator, getCategory)
  .put(uploadImages, resizeImage, updateCategoriyValedator, updateCategory)
  .delete(deleteCategoriyValedator, deleteCategory);
module.exports = router;
