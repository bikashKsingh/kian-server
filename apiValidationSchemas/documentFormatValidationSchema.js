const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  format: Joi.string().required().label("Format"),
  mimeType: Joi.string().required().label("MIME Type"),
  status: Joi.boolean().required().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string().valid("ALL", "true", "false", ""),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  format: Joi.string().required().label("Format"),
  mimeType: Joi.string().required().label("MIME Type"),
  status: Joi.boolean().required().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
