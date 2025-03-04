const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { COMPANY } = require("../constants/paymentCompany");

// create
module.exports.create = Joi.object({
  company: Joi.string()
    .valid(...COMPANY)
    .required()
    .label("Payment Company"),
  apiKey: Joi.string().required().label("Api Key"),
  apiSecret: Joi.string().required().label("Api Secret"),
  merchantId: Joi.string().required().label("Merchant ID"),
  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  email: Joi.string().email(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string().valid("ALL", "", "true", "false"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  company: Joi.string()
    .valid(...COMPANY)
    .required()
    .label("Payment Company"),
  apiKey: Joi.string().required().label("Api Key"),
  apiSecret: Joi.string().required().label("Api Secret"),
  merchantId: Joi.string().required().label("Merchant ID"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
