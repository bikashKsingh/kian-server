const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { SUBSCRIPTION_STATUS } = require("../constants/newsletter");

// create
module.exports.create = Joi.object({
  email: Joi.string().email().required().label("Email"),
  subscriptionStatus: Joi.string().valid(...SUBSCRIPTION_STATUS),
});

// findAll
module.exports.findAll = Joi.object({
  email: Joi.string().email(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  subscriptionStatus: Joi.string().valid(...SUBSCRIPTION_STATUS, "ALL", ""),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  email: Joi.string().required().label("Email"),
  subscriptionStatus: Joi.string().valid(...SUBSCRIPTION_STATUS, ""),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
