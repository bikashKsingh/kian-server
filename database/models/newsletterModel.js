const mongoose = require("mongoose");
const { SUBSCRIPTION_STATUS } = require("../../constants/newsletter");

const modelSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
    },

    subscriptionStatus: {
      type: String,
      enum: SUBSCRIPTION_STATUS,
      default: "SUBSCRIBED",
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

module.exports = mongoose.model("newsletter", modelSchema);
