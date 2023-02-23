const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    shipment: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: { type: String, required: true },
      provicne: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: false,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    payment: {
      order_id: {
        type: String,
      },
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
    },

    totalProduct: {
      type: Number,
      required: true,
      default: 0,
    },
    shipCost: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Menunggu Konfirmasi",
    },
    resi: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
