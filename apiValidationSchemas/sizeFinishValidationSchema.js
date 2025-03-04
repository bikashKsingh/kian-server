const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  size: Joi.string().required().label("Size"),
  finishes: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Finishes"),
  status: Joi.string().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  size: Joi.string(),
  finish: Joi.string(),
  finishes: Joi.array(),
  status: Joi.string().valid("ALL", "", "true", "false"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  size: Joi.string().required().label("Size"),
  finishes: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Finishes"),
  status: Joi.string().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
