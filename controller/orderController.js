const catchError = require("../utilities/catchError");
const ErrorHandler = require("../utilities/ErrorHandler");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Membuat pesanan / creating new order => client
exports.createOrder = catchError(async (req, res, next) => {
  const { shipment, orderItems, payment, totalProduct, shipCost, amount } =
    req.body;

  const order = await Order.create({
    shipment,
    orderItems,
    payment,
    totalProduct,
    shipCost,
    amount,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// detail order / single order => Admin & Client
exports.singlerOrder = catchError(async (req, res, next) => {
  const id = req.query.id;
  const order = await Order.findOne({ _id: id }).populate(
    "user",
    "name email phone"
  );

  if (!order) {
    return next(new ErrorHandler("Pesanan tidak ditemukan", 404));
  } else {
    res.status(200).json({
      success: true,
      order,
    });
  }
});

// Menampilkan seluruh pesanan saya / get all my orders => client
exports.myOrders = catchError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({
      createdAt: -1,
    })
    .limit(1);

  res.status(200).json({
    success: true,
    orders,
  });
});

// get All orders => Admin
exports.getOrders = catchError(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.amount;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// delete orders => admin
exports.deleteOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(
        `Pesanan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  } else {
    await order.remove();
    res.status(200).json({
      success: true,
      message: "Pesanan Berhasil Dihapus",
    });
  }
});

// Update order / procesing to delivered => admin
exports.updateOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Dikirm") {
    return next(new ErrorHandler("Pesanan ini sudah terkirim", 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;
  order.resi = req.body.resi;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order berhasil diperbarui",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

// Update payment status
exports.updatePayment = catchError(async (req, res) => {
  const order = await Order.findById(req.params.id);

  order.payment.status = req.body.status;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Pembanyaran berhasil diperbarui",
  });
});
