const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),

  category: Joi.string().required().label("Category"),
  subCategory: Joi.string().required().label("Sub Categories"),
  ingredients: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Ingredients"),

  baseSize: Joi.string().required().label("Size"),
  baseSalePrice: Joi.number().required().label("Sale Price"),
  baseDiscount: Joi.number().allow("").label("Base Discount"),
  baseDiscountType: Joi.string().allow("").label("Base Discount Type"),

  taxPercent: Joi.number().allow("").label("Tax Percent"),
  taxModel: Joi.string().allow("").label("Tax Model"),

  minimumOrderQuantity: Joi.number().label("Minimum Order Quantity"),
  shippingCost: Joi.number().allow("").label("Shipping Cost"),
  shippingMultiplyWithQuantity: Joi.boolean().label(
    "Shipping Multiply With Quantity"
  ),

  variants: Joi.array()
    .items(
      Joi.object({
        size: Joi.string(),
        salePrice: Joi.number(),
        discount: Joi.number(),
        discountType: Joi.string(),
      })
    )
    .label("Variants"),

  sku: Joi.string().allow("").label("SKU"),

  image: Joi.string().required().label("Image"),
  images: Joi.array().items(Joi.string().uri()).allow(null).label("Images"),

  shortDescription: Joi.string().allow("").label("Short Description"),

  tags: Joi.string().allow("").label("Tags"),

  description: Joi.string().allow("").label("Description"),
  howToUse: Joi.string().allow("").label("How To Use"),
  benefits: Joi.string().allow("").label("Benifits"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),

  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  slug: Joi.string(),
  category: Joi.string(),
  categorySlug: Joi.string(),
  subCategory: Joi.string(),

  categories: Joi.array(),
  subCategories: Joi.array(),
  subCategorySlug: Joi.string(),
  categoryWise: Joi.string(),

  // sizes: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),

  size: Joi.string(),
  status: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  name: Joi.string().label("Name"),
  slug: Joi.string().label("Slug"),

  category: Joi.string().label("Category"),
  subCategory: Joi.string().label("Sub Categories"),
  ingredients: Joi.array()
    .items(Joi.string())

    .label("Ingredients"),

  baseSize: Joi.string().label("Size"),
  baseSalePrice: Joi.number().label("Sale Price"),
  baseDiscount: Joi.number().allow("").label("Base Discount"),
  baseDiscountType: Joi.string().allow("").label("Base Discount Type"),

  taxPercent: Joi.number().allow("").label("Tax Percent"),
  taxModel: Joi.string().allow("").label("Tax Model"),

  minimumOrderQuantity: Joi.number().label("Minimum Order Quantity"),
  shippingCost: Joi.number().allow("").label("Shipping Cost"),
  shippingMultiplyWithQuantity: Joi.boolean().label(
    "Shipping Multiply With Quantity"
  ),

  variants: Joi.array()
    .items(
      Joi.object({
        size: Joi.string(),
        salePrice: Joi.number(),
        discount: Joi.number(),
        discountType: Joi.string(),
      })
    )
    .label("Variants"),

  sku: Joi.string().allow("").label("SKU"),

  image: Joi.string().label("Image"),
  images: Joi.array().items(Joi.string().uri()).allow(null).label("Images"),

  shortDescription: Joi.string().allow("").label("Short Description"),

  tags: Joi.string().allow("").label("Tags"),

  description: Joi.string().allow("").label("Description"),
  howToUse: Joi.string().allow("").label("How To Use"),
  benefits: Joi.string().allow("").label("Benifits"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),

  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
