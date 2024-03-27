const express = require("express");

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/Validator/subCategoryValidator");

// mergeParams Allow u to access parameters on other routers
const router = express.Router({ mergeParams: true });
const authService = require("../services/authService");
router
  .route("/")
  //setCategoryIdToBody set categoryId to body if we recive it before sending data
  .post(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
