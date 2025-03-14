const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { ORDER_STATUS } = require("../constants/orderStatus");
const { PAYMENT_MODE } = require("../constants/paymentMode");
const { PAYMENT_STATUS } = require("../constants/paymentStatus");

// create
module.exports.create = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),

  mobile: Joi.string().required().label("Mobile"),
  email: Joi.string().required().label("Email"),

  // Shipping Address
  address: Joi.string().required().label("Address"),
  locality: Joi.string().required().allow("").label("Locality"),
  city: Joi.string().required().allow("").label("City"),
  state: Joi.string().required().allow("").label("State"),
  country: Joi.string().required().allow("").label("Country"),
  pincode: Joi.string().required().allow("").label("Pincode"),

  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.custom(customCallback).label("Product"),
        qty: Joi.number().label("Qty"),
        size: Joi.string().label("Size"),
        baseSize: Joi.string().label("Base Size"),
      })
    )
    .required()
    .label("Products"),

  paymentMode: Joi.string()
    .valid(...PAYMENT_MODE, "")
    .required()
    .label("Payment Mode"),
});

// createRazorpayOrder
module.exports.createRazorpayOrder = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.custom(customCallback).label("Product"),
        qty: Joi.number().label("Qty"),
        size: Joi.string().label("Size"),
        baseSize: Joi.string().label("Base Size"),
      })
    )
    .required()
    .label("Products"),

  // paymentMode: Joi.string()
  //   .valid(...PAYMENT_MODE, "")
  //   .required()
  //   .label("Payment Mode"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  product: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  orderStatus: Joi.string().valid(...ORDER_STATUS, ""),
  paymentStatus: Joi.string().valid(...PAYMENT_STATUS, ""),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
