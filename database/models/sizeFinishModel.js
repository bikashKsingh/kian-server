const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    size: { type: mongoose.Schema.Types.ObjectId, ref: "size", required: true },
    finishes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "finish", required: true },
    ],

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

module.exports = mongoose.model("sizeFinish", modelSchema);
