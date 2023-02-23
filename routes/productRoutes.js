const express = require("express");
const {
  getAllProduct,
  detailProduct,
  createProduct,
  updateProduct,
  getAllProductAdmin,
  deleteProduct,
  getBySearch,
  deleteAllProducts,
} = require("../controller/productController");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../utilities/auth&authorizes");
const router = express.Router();

router.route("/products").get(getAllProduct);

router.route("/product/:id").get(detailProduct);

router.route("/search").get(getBySearch);

// admin's side
router
  .route("/admin/products")
  .get(authenticatedUser, authorizeRoles("admin"), getAllProductAdmin);

router
  .route("/admin/product/create")
  .post(authenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/update/:id")
  .put(authenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/product/delete/:id")
  .delete(authenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/product/deleteAll")
  .delete(authenticatedUser, authorizeRoles("admin"), deleteAllProducts);

module.exports = router;
