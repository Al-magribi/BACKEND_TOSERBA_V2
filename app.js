const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const cors = require("cors");

const errorMiddleware = require("./utilities/errorMiddleware");

app.use(cors());
app.use(express.json({ limit: "70mb" }));
app.use(bodyParser.json({ limit: "70mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "70mb",
    extended: true,
    parameterLimit: 70000,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  User.createStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      // Find the user with the given email
      User.findOne({ email: email }, function (err, user) {
        // If there's an error, finish trying to authenticate (auth failed)
        if (err) {
          return done(err);
        }
        // If no user present, auth failed
        if (!user) {
          return done(null, false);
        }
        // If passwords do not match, auth failed
        if (user.password !== password) {
          return done(null, false);
        }
        // Auth has has succeeded
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/shop", shopRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api", productRoutes);
app.use("/api/review", reviewRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/shipment", shipmentRoutes);

app.use("/api/payment", paymentRoutes);

app.use(errorMiddleware);

module.exports = app;
