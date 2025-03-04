const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { INQUIRY_TYPES } = require("../constants/inquiryTypes");
const { INQUIRY_STATUS } = require("../constants/inquiryStatus");

// create
module.exports.create = Joi.object({
  name: Joi.string().trim().required().min(3).label("Name"),
  email: Joi.string().email().trim().required().label("Email"),
  countryCode: Joi.string().trim().required().label("Country Code"),
  mobile: Joi.string()
    .regex(/^[1-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .label("Mobile"),

  message: Joi.string().allow("").trim().label("Message"),

  inquiryType: Joi.string()
    .required()
    .valid(...INQUIRY_TYPES),
  product: Joi.string().allow("").trim().label("Product"),
  resumeFile: Joi.string().allow("").trim().label("Resume"),
  position: Joi.string().allow("").trim().label("Position"),

  address: Joi.string().allow("").trim().label("Address"),
  locality: Joi.string().allow("").trim().label("Locality"),
  city: Joi.string().allow("").trim().label("City"),
  state: Joi.string().allow("").trim().label("State"),
  country: Joi.string().allow("").trim().required().label("Country"),
  pincode: Joi.string().allow("").trim().label("Pincode"),

  inquiryStatus: Joi.string().valid(...INQUIRY_STATUS),
});

// update
module.exports.update = Joi.object({
  name: Joi.string().trim().required().min(3).label("Name"),
  email: Joi.string().email().trim().required().label("Email"),
  countryCode: Joi.string().trim().label("Country Code"),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .label("Mobile"),

  message: Joi.string().allow("").trim().label("Message"),

  inquiryType: Joi.string().valid(...INQUIRY_TYPES),
  product: Joi.string().allow("").trim().label("Product"),
  resumeFile: Joi.string().allow("").trim().label("Resume"),
  position: Joi.string().allow("").trim().label("Position"),

  address: Joi.string().allow("").trim().label("Address"),
  locality: Joi.string().allow("").trim().label("Locality"),
  city: Joi.string().allow("").trim().label("City"),
  state: Joi.string().allow("").trim().label("State"),
  country: Joi.string().allow("").trim().required().label("Country"),
  pincode: Joi.string().allow("").trim().label("Pincode"),

  inquiryStatus: Joi.string().valid(...INQUIRY_STATUS),
});

// findAll
module.exports.findAll = Joi.object({
  email: Joi.string().email(),
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  inquiryType: Joi.string().valid(...INQUIRY_TYPES, "ALL", ""),
  inquiryStatus: Joi.string().valid(...INQUIRY_STATUS, "ALL", ""),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});

// -------------- ADMIN SECTION END --------------
