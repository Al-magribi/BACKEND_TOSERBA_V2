const catchError = require("../utilities/catchError");
const Product = require("../models/Product");

// All Products
exports.getAllProduct = catchError(async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const searchTerm = req.query.name;

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createAt: -1 });
    } else if (qCategory) {
      products = await Product.find({
        category: {
          $in: [qCategory],
        },
      });

      res.status(200).json({
        products,
      });
    } else if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");

      const products = await Product.find({
        name: { $regex: searchRegex },
      });

      res.status(200).json({ count: products.length, products });
    } else {
      products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        count: products.length,
        products,
      });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
  }
});

// Get product by search function
exports.getBySearch = catchError(async (req, res) => {
  try {
    const searchTerm = req.query.name;
    const searchRegex = new RegExp(searchTerm, "i");

    const products = await Product.find({
      name: { $regex: searchRegex },
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(404).json({ error: error, message: "Tidak ditemukan" });
  }
});

//Detail Prodcut
exports.detailProduct = catchError(async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({ product });
});

// Create product => admin
exports.createProduct = catchError(async (req, res) => {
  req.body.user = req.user.id;

  req.body.profit = req.body.price - req.body.capital;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// update product => admin
exports.updateProduct = catchError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  req.body.profit = req.body.price - req.body.capital;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// Detele product from database => admin
exports.deleteProduct = catchError(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
  }

  await product.remove();
  res.status(200).json({ success: true, message: "Produk berhasil dihapus" });
});

// delete All product from database => admin
exports.deleteAllProducts = catchError(async (req, res) => {
  await Product.deleteMany();

  res
    .status(200)
    .json({ success: true, message: "Semua produk berhasil dihapus" });
});

//Get product from admin's side =>admin
exports.getAllProductAdmin = catchError(async (req, res) => {
  const product = await Product.find();

  res.status(200).json({
    success: true,
    product,
  });
});
