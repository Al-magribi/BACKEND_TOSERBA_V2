const catchError = require("../utilities/catchError");
const User = require("../models/User");
const passport = require("passport");
const sendToken = require("../utilities/sendToken");
const ErrorHandler = require("../utilities/errorHandler");

// user registration
exports.userRegister = catchError(async (req, res) => {
  const phoneNumber = req.body.phone.replace(/^0/, "62");

  User.register(
    {
      name: req.body.name,
      username: req.body.username,
      phone: phoneNumber,
      avatar: req.body.avatar,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        res.status(500).json({ success: false, message: err });
      } else {
        passport.authenticate("local")(req, res, function () {
          sendToken(user, 200, res);
        });
      }
    }
  );
});

// user login
exports.userLogin = catchError(async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(500).json({ success: false, message: err });
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user tidak ditemukan" });
    }
    req.logIn(user, function (err) {
      if (err) {
        res.status(500).json({ success: false, message: err });
      }
      sendToken(user, 200, res);
    });
  })(req, res, next);
});

exports.userLogout = catchError(async (req, res) => {
  req.logout((err) => {
    if (err) {
      // handle error
      res.status(500).json({
        success: false,

        message: "Logout Gagal, Terjadi kesalahan pada server",
        error: err,
      });
      v;
    } else {
      req.session.destroy();

      res.clearCookie("connect.sid"); // clean up!

      res.cookie("token", null, {
        expires: new Date(Date.now()),
        htppOnly: true,
      });
      res.status(200).json({ success: true });
    }
  });
});
