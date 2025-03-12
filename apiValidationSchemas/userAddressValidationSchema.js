const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  mobile: Joi.string().required().label("Mobile"),
  email: Joi.string().email().required().label("EMail"),

  address: Joi.string().required().label("Address"),
  locality: Joi.string().required().label("Locality"),
  city: Joi.string().required().label("City"),
  state: Joi.string().required().label("State"),
  pincode: Joi.string().required().label("Pincode"),
  country: Joi.string().required().label("Country"),

  addressType: Joi.string().required().label("Address Type"),

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
  firstName: Joi.string().label("First Name"),
  lastName: Joi.string().label("Last Name"),
  mobile: Joi.string().label("Mobile"),
  email: Joi.string().email().label("EMail"),

  address: Joi.string().label("Address"),
  locality: Joi.string().label("Locality"),
  city: Joi.string().label("City"),
  state: Joi.string().label("State"),
  pincode: Joi.string().label("Pincode"),
  country: Joi.string().label("Country"),

  addressType: Joi.string().label("Address Type"),

  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
