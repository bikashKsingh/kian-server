const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../../constants/orderStatus");
const { DISCOUNT_TYPE } = require("../../constants/discountType");
const { PAYMENT_STATUS } = require("../../constants/paymentStatus");
const modelSchema = new mongoose.Schema(
  {
    orderId: { type: Number, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    // Shipping Address
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    address: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    products: [
      {
        product: { ref: "product", type: mongoose.Schema.Types.ObjectId },
        name: String,
        image: String,
        salePrice: Number,
        discount: { type: Number, default: 0 },
        discountType: { type: String, enum: DISCOUNT_TYPE, default: "" },
        category: { ref: "category", type: mongoose.Schema.Types.ObjectId },
        qty: Number,
        size: { ref: "size", type: mongoose.Schema.Types.ObjectId },
        subCategory: {
          ref: "subCategory",
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],

    couponCode: {
      type: String,
      default: null,
    },
    couponDiscountAmount: {
      type: Number,
      default: 0,
    },

    shippingCharges: { type: Number, default: 0 },

    subtotalAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    // Payment Gateway Details
    paymentMode: { type: String, trim: true, default: null },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "PENDING",
    },
    transactionId: { type: String, unique: true, sparse: true }, // Payment transaction ID
    paymentResponse: { type: mongoose.Schema.Types.Mixed, default: null }, // Store raw response
    paymentDate: { type: Date, default: null },
    gatewayName: { type: String, trim: true, default: null }, // Razorpay, PayPal, Stripe
    currency: { type: String, trim: true, default: "INR" }, // Default to INR

    orderStatus: { type: String, enum: ORDER_STATUS, default: "CONFIRMED" },
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

module.exports = mongoose.model("order", modelSchema);
