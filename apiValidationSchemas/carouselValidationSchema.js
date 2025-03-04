const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  title: Joi.string().label("Title"),
  subTitle: Joi.string().label("Sub Title"),
  image: Joi.string().label("Image"),
  shortDescription: Joi.string().allow("").label("Short Description"),
  buttonText: Joi.string().allow("").label("Button Text"),
  buttonLink: Joi.string().allow("").label("Button Link"),
  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  title: Joi.string().label("Title"),
  subTitle: Joi.string().label("Sub Title"),
  image: Joi.string().label("Image"),
  shortDescription: Joi.string().allow("").label("Short Description"),
  buttonText: Joi.string().allow("").label("Button Text"),
  buttonLink: Joi.string().allow("").label("Button Link"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
