const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
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
  getMyData,
  changeMyPassword,
  updateMyData,
  deActiveMe,
  activeMe,
} = require("../services/userService");

const authService = require("../services/authService");
const router = express.Router();

//for logged in user
router.get("/getMe", authService.protected, getMyData, getUser);
router.put("/changeMyPassword", authService.protected, changeMyPassword);
router.put(
  "/updateMyData",
  authService.protected,
  updateLoggedUserValidator,
  updateMyData
);
router.put("/deActiveMe", authService.protected, deActiveMe);
router.put("/activeMe", authService.protected, activeMe);

//for only admin
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
