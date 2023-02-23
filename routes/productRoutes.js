const express = require("express");
const multer = require("multer");
const {
  getAllProduct,
  detailProduct,
  createProduct,
  uploadFileExcel,
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
const fs = require("fs");

// Create upload folder if it doesn't exist
if (!fs.existsSync("../upload")) {
  fs.mkdirSync("../upload");
}

//set up multer file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../upload/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

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
  .route("/admin/product/uploadExcel")
  .post(
    authenticatedUser,
    authorizeRoles("admin"),
    upload.single("file"),
    uploadFileExcel
  );

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
