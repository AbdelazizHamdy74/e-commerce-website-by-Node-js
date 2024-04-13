const express = require("express");

const {
  addAddress,
  removeAddress,
  getMyAddresses,
} = require("../services/addressService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(authService.protected, authService.allowedTo("user"), getMyAddresses)
  .post(authService.protected, authService.allowedTo("user"), addAddress);
router
  .route("/:addressId")
  .delete(authService.protected, authService.allowedTo("user"), removeAddress);

module.exports = router;
