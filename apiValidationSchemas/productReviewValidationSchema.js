const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { REVIEW_STATUS } = require("../constants/reviewStatus");

// create
module.exports.create = Joi.object({
  user: Joi.string().required().label("User"),
  product: Joi.string().required().label("Product"),
  displayName: Joi.string().allow("").label("Display Name"),
  rating: Joi.number().allow("").label("Rating"),
  reviewText: Joi.string().allow("").label("Review Text"),
  reviewStatus: Joi.string()
    .valid(...REVIEW_STATUS)
    .label("Review Status"),
}).or("rating", "reviewText"); // Require at least one of rating or reviewText

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  reviewStatus: Joi.string().valid(...REVIEW_STATUS, "All"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  user: Joi.string().required().label("User"),
  product: Joi.string().required().label("Product"),
  displayName: Joi.string().allow("").label("Display Name"),
  rating: Joi.number().allow("").label("Rating"),
  reviewText: Joi.string().allow("").label("Review Text"),
  reviewStatus: Joi.string()
    .valid(...REVIEW_STATUS)
    .label("Review Status"),
}).or("rating", "reviewText"); // Require at least one of rating or reviewText

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
