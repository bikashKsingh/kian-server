const mongoose = require("mongoose");
const { TAX_MODEL } = require("../../constants/taxModel");
const { DISCOUNT_TYPE } = require("../../constants/discountType");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    slug: { type: String, unique: true, required: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },

    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "ingredient" }],

    baseSize: { type: mongoose.Schema.Types.ObjectId, ref: "size" },
    baseSalePrice: { type: Number, default: 0 },
    baseDiscount: { type: Number, default: 0 },
    baseDiscountType: { type: String, enum: DISCOUNT_TYPE, default: "" },
    // baseMrp: { type: Number, default: 0 },

    taxPercent: { type: Number, default: 0 },
    taxModel: { type: String, enum: TAX_MODEL, default: "INCLUDE" },

    minimumOrderQuantity: { type: Number, default: 1 },
    shippingCost: { type: Number, default: 0 },
    shippingMultiplyWithQuantity: { type: Boolean, default: false },

    variants: [
      {
        size: { type: mongoose.Schema.Types.ObjectId, ref: "size" },
        salePrice: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        discountType: { type: String, enum: DISCOUNT_TYPE, default: "" },
      },
    ],

    sku: { type: String, trim: true },

    image: { type: String, trim: true, required: true },
    images: { type: String, trim: true },

    description: { type: String, trim: true },
    benefits: { type: String, trim: true },
    howToUse: { type: String, trim: true },

    shortDescription: { type: String, trim: true },
    tags: { type: String, trim: true, default: "" },

    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    metaKeywords: { type: String, default: "", trim: true },

    status: { type: Boolean, default: true },
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

module.exports = mongoose.model("product", modelSchema);
