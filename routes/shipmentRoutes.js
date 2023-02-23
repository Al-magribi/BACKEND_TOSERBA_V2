const express = require("express");
const {
  getAllProvinces,
  getAllCities,
  getCost,
} = require("../controller/shipmentController");
const router = express.Router();

router.route("/province").get(getAllProvinces);
router.route("/city/:id").get(getAllCities);
router.route("/cost/:origin/:destination/:weight/:courieries").get(getCost);

module.exports = router;
