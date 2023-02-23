const express = require("express");
const {
  createOrder,
  singlerOrder,
  myOrders,
  getOrders,
  deleteOrder,
  updateOrder,
  updatePayment,
} = require("../controller/orderController");
const router = express.Router();
const {
  authenticatedUser,
  authorizeRoles,
} = require("../utilities/auth&authorizes");

// creating ner order
router.route("/create").post(authenticatedUser, createOrder);

// Order Detail
router.route("/detail").get(authenticatedUser, singlerOrder);

// get my orders
router.route("/myorders").get(authenticatedUser, myOrders);

// get all orders => admin
router
  .route("/admin/orders")
  .get(authenticatedUser, authorizeRoles("admin"), getOrders);

// delete order => admin
router
  .route("/admin/order/:id")
  .delete(authenticatedUser, authorizeRoles("admin"), deleteOrder);

// Genreal section
// Update order's processing to delivered
router.route("/admin/order/update/:id").put(authenticatedUser, updateOrder);
router
  .route("/payment/update-status/:id")
  .put(authenticatedUser, updatePayment);
router;

module.exports = router;
