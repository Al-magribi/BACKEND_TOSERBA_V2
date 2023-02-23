const express = require("express");
const {
  getAllUsers,
  userDetail,
  userUpdateProfile,
  userUpdatePassword,
  userDelete,
  userUpdate,
  getUserDetail,
  updateUser,
} = require("../controller/userController");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../utilities/auth&authorizes");
const router = express.Router();

// Routes
router.route("/profile").get(authenticatedUser, userDetail);
router.route("/update").put(authenticatedUser, userUpdateProfile);
router.route("/update-password").post(authenticatedUser, userUpdatePassword);

// Admin
router
  .route("/all")
  .get(authenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/detail/:id")
  .get(authenticatedUser, authorizeRoles("admin"), getUserDetail);

router
  .route("/update-user/:id")
  .put(authenticatedUser, authorizeRoles("admin"), updateUser);

router
  .route("/delete/:id")
  .delete(authenticatedUser, authorizeRoles("admin"), userDelete);

router
  .route("/edit/:id")
  .put(authenticatedUser, authorizeRoles("admin"), userUpdate);

module.exports = router;
