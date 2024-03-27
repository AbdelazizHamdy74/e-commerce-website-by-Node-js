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

const authService = require("../services/authService");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadImages,
    resizeImage,
    createCategoriyValedator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoriyValedator, getCategory)
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    uploadImages,
    resizeImage,
    updateCategoriyValedator,
    updateCategory
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteCategoriyValedator,
    deleteCategory
  );
module.exports = router;
