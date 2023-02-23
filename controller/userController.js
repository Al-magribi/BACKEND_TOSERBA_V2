const catchError = require("../utilities/catchError");
const User = require("../models/User");
const ErrorHandler = require("../utilities/errorHandler");

// All User => admin's side
exports.getAllUsers = catchError(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "User tidak ditemukan" });
  }
});

// Update user from database => admin
exports.userUpdate = catchError(async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User tidak ditemukan", 404));
  } else {
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Berhasil diupdate",
      user,
    });
  }
});

// Delete user from database => admin
exports.userDelete = catchError(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User tidak ditemukan", 404));
  } else {
    await user.remove();
    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  }
});

// get User Detail => admin
exports.getUserDetail = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User tidak ditemukan", 404));
  } else {
    res.status(200).json({ success: true, user });
  }
});

// User detail
exports.userDetail = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("user tidak ditemukan", 404));
  } else {
    res.status(200).json({
      success: true,
      user,
    });
  }
});

// update user => admin
exports.updateUser = catchError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    username: req.body.username,
    phone: req.body.phone,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, user });
});

// Update profile name, username => user
exports.userUpdateProfile = catchError(async (req, res) => {
  const updateProfile = {
    name: req.body.name,
    username: req.body.username,
    phone: req.body.phone,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateProfile, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// update password
exports.userUpdatePassword = catchError(async (req, res) => {
  User.findByUsername(req.body.username, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      user.changePassword(
        req.body.oldPassword,
        req.body.newPassword,
        function (err) {
          if (err) {
            res.send(err);
          } else {
            res.status(200).json({ success: true, user });
          }
        }
      );
    }
  });
});
