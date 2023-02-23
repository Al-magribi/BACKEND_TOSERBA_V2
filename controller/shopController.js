const catchError = require("../utilities/catchError");
const Shop = require("../models/Shop");

// Create Shop Identity
exports.createShop = catchError(async (req, res) => {
  const shop = await Shop.create(req.body);

  res.status(200).json({ success: true, shop });
});

// Update Shop Identity
exports.updateShop = catchError(async (req, res) => {
  let shop = await Shop.findById(req.params.id);

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, shop });
});
