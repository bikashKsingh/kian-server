const mongoose = require("mongoose");
const { COMPANY } = require("../../constants/paymentCompany");
const modelSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      enum: COMPANY,
      unique: true,
      required: true,
    },
    apiKey: {
      type: String,
      trim: true,
      required: true,
    },
    apiSecret: {
      type: String,
      trim: true,
      required: true,
    },
    merchantId: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("paymentSetting", modelSchema);
