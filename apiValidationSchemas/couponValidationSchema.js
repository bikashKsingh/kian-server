const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const {
  COUPON_USERS,
  DISCOUNT_TYPE,
  COUPON_STATUS,
  COUPON_LEVEL,
} = require("../constants/coupon");

// create
module.exports.create = Joi.object({
  couponCode: Joi.string().required().label("Coupon Code"),
  applyFor: Joi.string()
    .valid(...COUPON_USERS)
    .required()
    .label("Coupon User"),
  discountType: Joi.string()
    .valid(...DISCOUNT_TYPE)
    .required()
    .label("Discount Type"),
  discount: Joi.number().required().label("Discount"),
  description: Joi.string().allow("").label("Description"),
  minimumAmount: Joi.number().required().label("Min Amount"),
  numberOfUsesTimes: Joi.number().required().label("No of Uses"),
  startDate: Joi.string().required().label("Start Date"),
  expiryDate: Joi.string().required().label("Expiry Date"),

  couponLevel: Joi.string().valid(...COUPON_LEVEL),
  categories: Joi.array().items(Joi.custom(customCallback)).label("Categories"),
  products: Joi.array().items(Joi.custom(customCallback)).label("Products"),
  autoApply: Joi.boolean().label("Auto Apply"),

  // image: Joi.string().allow("").label("Image"),
  couponStatus: Joi.string()
    .valid(...COUPON_STATUS)
    .required()
    .label("Coupon Status"),
});

// findAll
module.exports.findAll = Joi.object({
  couponCode: Joi.string(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  couponStatus: Joi.string().valid(...COUPON_STATUS, "ALL", ""),
});

// getPromotions
module.exports.getPromotions = Joi.object({
  order_id: Joi.string().required().label("Order Id"),
  contact: Joi.string().allow("").label("Contact"),
  email: Joi.string().allow("").label("Email"),
});

// applyPromotion
module.exports.applyPromotion = Joi.object({
  order_id: Joi.string().required().label("Order Id"),
  contact: Joi.string().label("Contact"),
  email: Joi.string().label("Email"),
  code: Joi.string().required().label("Code"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// validateCoupon
module.exports.validateCoupon = Joi.object({
  couponCode: Joi.string().required(),
  plan: Joi.string().allow(""),
  category: Joi.string().allow(""),
  program: Joi.string().allow(""),
});

// update
module.exports.update = Joi.object({
  couponCode: Joi.string().required().label("Coupon Code"),
  applyFor: Joi.string()
    .valid(...COUPON_USERS)
    .required()
    .label("Coupon User"),
  discountType: Joi.string()
    .valid(...DISCOUNT_TYPE)
    .required()
    .label("Discount Type"),
  discount: Joi.number().required().label("Discount"),

  couponLevel: Joi.string().valid(...COUPON_LEVEL),
  categories: Joi.array().items(Joi.custom(customCallback)).label("Categories"),
  products: Joi.array().items(Joi.custom(customCallback)).label("Products"),
  autoApply: Joi.boolean().label("Auto Apply"),

  description: Joi.string().allow("").label("Description"),
  minimumAmount: Joi.number().required().label("Min Amount"),
  numberOfUsesTimes: Joi.number().required().label("No of Uses"),
  startDate: Joi.string().required().label("Start Date"),
  expiryDate: Joi.string().required().label("Expiry Date"),
  //   image: Joi.string().allow("").label("Image"),
  couponStatus: Joi.string()
    .valid(...COUPON_STATUS)
    .required()
    .label("Coupon Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
