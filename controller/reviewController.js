const catchError = require("../utilities/catchError");
const Product = require("../models/Product");

exports.createReview = catchError(async (req, res) => {
  // get review from user
  const { rating, comment, productId } = req.body;

  // make review as object
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Find the product which will be reviewed
  const product = await Product.findById(productId);

  // Chcek the product is reviewed or not
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  // If product is reviewed
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        (review.comment = comment), (review.rating = rating);
      }
    });
  } else {
    // if product isnt reviewed
    product.reviews.push(review);
    product.allReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

// get Review
exports.getProductReviews = catchError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviwew
exports.deleteReview = catchError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const allReviews = reviews.length;

  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      allReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
