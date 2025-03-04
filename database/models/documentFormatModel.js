const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    format: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    mimeType: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("documentFormat", modelSchema);
