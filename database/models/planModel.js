const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    days: {
      type: Number,
    },
    // image: {
    //   type: String,
    //   trim: true,
    // },

    // shortDescription: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },
    // metaTitle: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },
    // metaDescription: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },
    // metaKeywords: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },
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

module.exports = mongoose.model("plan", modelSchema);
