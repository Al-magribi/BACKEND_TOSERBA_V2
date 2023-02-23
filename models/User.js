const mongoose = require("mongoose");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Masukan nama anda"],
      unique: true,
    },
    email: {
      type: String,
      require: [false, "Masukan email anda"],
      unique: true,
      validate: [validator.isEmail, "Masukan email yang valid"],
    },
    phone: {
      type: String,
      unique: true,
      require: [true, "Masukan no tlp"],
    },
    password: {
      type: String,
      require: false,
      minlength: [6, "minimal password 6 karakter"],
      select: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "user",
    },
    //Mereset password user jika user lupa
    resetPasswordToken: String,
    //Masa aktif link untuk mereset password
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Mengenkripsi password sebelum di save ke database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Membandingkan password yang di input user dengan databse
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate JSON WEB TOKEN
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Generate TOKEN in Reseting Password
userSchema.methods.ResetPasswordToken = function () {
  //Generate TOKEN
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hash and Set Reset Password
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set TOKEN Expires
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

userSchema.methods.validPassword = function (password) {
  // EXAMPLE CODE!
  return this.password === password;
};

module.exports = mongoose.model("User", userSchema);
