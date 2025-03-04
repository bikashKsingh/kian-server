const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { GENDER } = require("../constants/gender");

// create
module.exports.create = Joi.object({
  firstName: Joi.string().trim().required().min(2).label("First Name"),
  lastName: Joi.string().trim().required().min(2).label("Last Name"),
  email: Joi.string().email().trim().required().label("Email"),

  // dob: Joi.string().trim().required().label("DOB"),
  // gender: Joi.string()
  //   .valid(...GENDER)
  //   .required()
  //   .label("Gender"),

  // countryCode: Joi.string().required().label("Country Code"),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .required()
    .label("Mobile"),

  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .required()
    .min(6)
    .messages({
      "string.empty": `"Password" must not be empty`,
      "string.pattern.base": `"Pasword" must be a mix of number, char, and special char`,
    })
    .label("Password"),
});

// verifyAccount
module.exports.verifyAccount = Joi.object({
  otp: Joi.string().trim().required().min(4).label("OTP"),
});

// login
module.exports.login = Joi.object({
  email: Joi.string().email().trim().required().label("Email"),
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .required()
    .min(6)
    .messages({
      "string.empty": `"Password" must not be empty`,
      "string.pattern.base": `"Pasword" must be a mix of number, char, and special char`,
    })
    .label("Password"),
});

// updateProfile
module.exports.updateProfile = Joi.object({
  firstName: Joi.string().trim().min(2).label("First Name"),
  lastName: Joi.string().trim().min(2).label("Last Name"),

  dob: Joi.string().trim().label("DOB"),
  gender: Joi.string()
    .valid(...GENDER)
    .label("Gender"),

  address: Joi.string().allow("").trim().label("Address"),
  locality: Joi.string().allow("").trim().label("Locality"),
  city: Joi.string().allow("").trim().label("City"),
  state: Joi.string().allow("").trim().label("State"),
  country: Joi.string().allow("").trim().label("Country"),
  pincode: Joi.string().allow("").trim().label("Pincode"),

  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .min(6)
    .messages({
      "string.empty": `"Password" must not be empty`,
      "string.pattern.base": `"Password" must be a mix of number, char, and special char`,
    })
    .label("Password"),
  oldPassword: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .min(6)
    .messages({
      "string.empty": `"oldPassword" must not be empty`,
      "string.pattern.base": `"oldPassword" must be a mix of number, char, and special char`,
    })
    .label("Old Password"),
});

// findAccount
module.exports.findAccount = Joi.object({
  email: Joi.string().email().trim().required().label("Email"),
});

// verifyOTP
module.exports.verifyOtp = Joi.object({
  email: Joi.string().email().trim().required().label("Email"),
  otp: Joi.string().trim().required().min(4).label("OTP"),
});

// createNewPassword
module.exports.createNewPassword = Joi.object({
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .required()
    .min(6)
    .messages({
      "string.empty": `"Password" must not be empty`,
      "string.pattern.base": `"Pasword" must be a mix of number, char, and special char`,
    })
    .label("Password"),
  cPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } })
    .label("Confirm Password"),
});

// -------------- ADMIN SECTION --------------

// update
module.exports.update = Joi.object({
  firstName: Joi.string().trim().label("First Name"),
  lastName: Joi.string().trim().label("Last Name"),

  dob: Joi.string().trim().label("DOB"),
  gender: Joi.string()
    .valid(...GENDER)
    .label("Gender"),

  countryCode: Joi.string().required().label("Country Code"),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .label("Mobile"),

  email: Joi.string().email().trim().label("Email"),

  address: Joi.string().allow("").trim().label("Address"),
  locality: Joi.string().allow("").trim().label("Locality"),
  city: Joi.string().allow("").trim().label("City"),
  state: Joi.string().allow("").trim().label("State"),
  country: Joi.string().allow("").trim().label("Country"),
  pincode: Joi.string().allow("").trim().label("Pincode"),
  facebook: Joi.string().allow("").trim().label("Facebook"),
  instagram: Joi.string().allow("").trim().label("Instagram"),
  twitter: Joi.string().allow("").trim().label("Twitter"),
  x: Joi.string().allow("").trim().label("X"),
  youtube: Joi.string().allow("").trim().label("Youtube"),
  linkedin: Joi.string().allow("").trim().label("Linkedin"),
  password: Joi.string().allow("").trim().label("Password"),
  status: Joi.string().trim().label("State"),
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

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});

// -------------- ADMIN SECTION END --------------
