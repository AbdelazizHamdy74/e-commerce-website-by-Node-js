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
} = require("../services/categoryService");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(createCategoriyValedator, createCategory);
router
  .route("/:id")
  .get(getCategoriyValedator, getCategory)
  .put(updateCategoriyValedator, updateCategory)
  .delete(deleteCategoriyValedator, deleteCategory);
module.exports = router;
