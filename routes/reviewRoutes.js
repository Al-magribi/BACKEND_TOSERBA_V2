const express = require("express");
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controller/reviewController");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../utilities/auth&authorizes");
const router = express.Router();

router.route("/create").put(authenticatedUser, createReview);
router
  .route("/get")
  .get(authenticatedUser, authorizeRoles("admin"), getProductReviews);
router
  .route("/delete")
  .delete(authenticatedUser, authorizeRoles("admin"), deleteReview);
module.exports = router;
