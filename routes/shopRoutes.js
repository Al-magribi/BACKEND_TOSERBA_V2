const express = require("express");
const { createShop, updateShop } = require("../controller/shopController");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../utilities/auth&authorizes");
const router = express.Router();

router
  .route("/create")
  .post(authenticatedUser, authorizeRoles("admin"), createShop);
router
  .route("/update/:id")
  .put(authenticatedUser, authorizeRoles("admin"), updateShop);

module.exports = router;
