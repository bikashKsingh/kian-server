const mongoose = require("mongoose");
const { REVIEW_STATUS } = require("../../constants/reviewStatus");
const Schema = mongoose.Schema;

// Define the Review schema
const productReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product", // Reference to the Product model
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
      required: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, // Minimum length of the review text
    },
    reviewStatus: {
      type: String,
      enum: REVIEW_STATUS,
      default: REVIEW_STATUS[0],
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

module.exports = mongoose.model("productReview", productReviewSchema);
