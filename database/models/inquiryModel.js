const mongoose = require("mongoose");
const { INQUIRY_STATUS } = require("../../constants/inquiryStatus");
const { INQUIRY_TYPES } = require("../../constants/inquiryTypes");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    countryCode: { type: String, default: "" },
    mobile: { type: String, default: "" },

    message: { type: String, default: "" },

    inquiryType: {
      type: String,
      enum: INQUIRY_TYPES,
      default: INQUIRY_TYPES[0],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    resumeFile: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },

    // Address
    address: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    // Inquiry Status
    inquiryStatus: {
      type: String,
      enum: INQUIRY_STATUS,
      default: "PENDING",
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("inquiry", modelSchema);
