const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: [true, "Nama toko harus diisi"] },
    motto: { type: String },
    province: { type: String, required: [true, "Pilih provinsi"] },
    city: { type: String, required: [true, "Pilih kota"] },
    cityId: { type: Number },
    address: { type: String, required: [true, "Masukan alamat detail"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
