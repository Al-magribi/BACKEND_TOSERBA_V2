const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Masukan nama produk"],
    },
    img: { type: String, required: false },

    price: {
      type: Number,
      required: [true, "Masukan harga produk"],
      default: 0,
    },
    capital: {
      type: Number,
      required: [false, "Masukan modal"],
      default: 0,
    },
    profit: { type: Number, default: 0 },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    desc: {
      type: String,
      required: [false, "Masukan deskirpsi produk"],
    },
    category: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, "Masukan stok produk"],
      default: 0,
    },
    weight: {
      type: Number,
      required: [true, "masukan berat produk"],
    },

    ratings: {
      type: Number,
      default: 0,
    },
    allReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
