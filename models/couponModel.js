const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minlength: [2, "Too short Name"],
      maxlength: [32, "Too long Name"],
    },
    expire: {
      type: Date,
      required: [true, "Expire is required"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount must be greater than 0"],
      max: [100, "Discount must be less than or equal 100"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
