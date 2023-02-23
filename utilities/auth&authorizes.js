const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchError = require("./catchError");
const ErrorHandler = require("./errorHandler");

exports.authenticatedUser = catchError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this page", 401));
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  }
});

exports.authorizeRoles = (...roles) => {
  return catchError(async (req, res, next) => {
    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Hanya admin yang dapat mengakses halaman ini`, 403)
      );
    }
    next();
  });
};
