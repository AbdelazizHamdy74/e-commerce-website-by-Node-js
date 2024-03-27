const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/Validator/userValidator");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../services/userService");

const authService = require("../services/authService");
const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    getUsers
  )
  .post(
    authService.protected,
    authService.allowedTo("suberAdmin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    getUserValidator,
    getUser
  )
  .put(
    authService.protected,
    authService.allowedTo("suberAdmin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin", "suberAdmin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
