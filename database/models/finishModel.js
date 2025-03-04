const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    shortName: {
      type: String,
      trim: true,
      unique: true,
    },

    fullName: {
      type: String,
      trim: true,
      unique: true,
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

module.exports = mongoose.model("finish", modelSchema);
