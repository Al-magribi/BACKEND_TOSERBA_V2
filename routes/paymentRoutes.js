const express = require("express");
const {
  proceedPayment,
  midtransApi,
  paymentResponse,
} = require("../controller/paymentController");
const { authenticatedUser } = require("../utilities/auth&authorizes");
const router = express.Router();

router.route("/transaction").post(authenticatedUser, proceedPayment);
router.route("/status/:order_id").get(authenticatedUser, paymentResponse);
router.route("/midtransapi").get(authenticatedUser, midtransApi);

module.exports = router;
