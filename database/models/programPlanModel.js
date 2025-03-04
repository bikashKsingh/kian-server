const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "program",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "plan",
    },
    planDuration: {
      type: Number,
      required: true,
      default: 0,
    },
    salePriceInr: {
      type: Number,
      required: true,
      default: 0,
    },

    mrpInr: {
      type: Number,
      required: true,
      default: 0,
    },
    salePriceDollar: {
      type: Number,
      required: true,
      default: 0,
    },
    mrpDollar: {
      type: Number,
      required: true,
      default: 0,
    },
    ptSession: {
      type: Number,
      default: 0,
    },
    groupSession: {
      type: Number,
      default: 0,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    features: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
      required: true,
    },
    isCancellable: {
      type: Boolean,
      default: false,
      required: true,
    },
    cancellationPeriod: {
      type: Number,
      default: 0,
      required: true,
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

module.exports = mongoose.model("programPlan", modelSchema);
