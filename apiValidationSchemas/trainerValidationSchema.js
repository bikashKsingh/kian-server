const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { GENDER } = require("../constants/gender");

// create
module.exports.create = Joi.object({
  name: Joi.string().trim().required().min(3).label("Name"),
  userName: Joi.string().trim().required().label("User Name"),
  designation: Joi.string().trim().required().label("Designation"),
  dob: Joi.string().trim().required().label("Dob"),
  gender: Joi.string()
    .valid(...GENDER)
    .trim()
    .required()
    .label("Gender"),

  level: Joi.string().trim().allow("").label("Level"),
  profilePhoto: Joi.string().uri().trim().allow("").label("Profile Photo"),
  video: Joi.string().trim().allow("").label("Video"),
  email: Joi.string().email().trim().required().label("Email"),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .label("Mobile"),
  bio: Joi.string().trim().allow("").label("Bio"),
  specialities: Joi.array().items(Joi.string()).label("Specialities"),
  interests: Joi.array().items(Joi.string()).label("Interests"),
  certificates: Joi.array().items(Joi.object()).label("Certificates"),
  kycDocuments: Joi.array().items(Joi.object()).label("KYC Documents"),

  meetingLink: Joi.string().trim().allow("").label("Meeting Link"),

  address: Joi.string().trim().allow("").label("Address"),
  locality: Joi.string().trim().allow("").label("Locality"),
  city: Joi.string().trim().allow("").label("City"),
  state: Joi.string().trim().allow("").label("State"),
  country: Joi.string().trim().allow("").label("Country"),
  pincode: Joi.string().trim().allow("").label("Pincode"),
  facebook: Joi.string().trim().allow("").label("Facebook"),
  instagram: Joi.string().trim().allow("").label("Instagram"),
  x: Joi.string().trim().allow("").label("X"),
  youtube: Joi.string().trim().allow("").label("Youtube"),
  linkedin: Joi.string().trim().allow("").label("Linkedin"),

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

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string().valid("ALL", "true", "false"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
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

// update
// create
module.exports.update = Joi.object({
  name: Joi.string().trim().required().min(3).label("Name"),
  userName: Joi.string().trim().required().label("User Name"),
  designation: Joi.string().trim().required().label("Designation"),
  dob: Joi.string().trim().required().label("Dob"),
  gender: Joi.string()
    .valid(...GENDER)
    .trim()
    .required()
    .label("Gender"),

  level: Joi.string().trim().allow("").label("Level"),
  profilePhoto: Joi.string().uri().trim().allow("").label("Profile Photo"),
  video: Joi.string().trim().allow("").label("Video"),
  email: Joi.string().email().trim().required().label("Email"),
  mobile: Joi.string()
    .regex(/^[6-9]\d{9}$/)
    .messages({
      "string.empty": `"Mobile" must contain value`,
      "string.pattern.base": `"Mobile" must be a valid Number`,
    })
    .label("Mobile"),
  bio: Joi.string().trim().allow("").label("Bio"),
  specialities: Joi.array().items(Joi.string()).label("Specialities"),
  interests: Joi.array().items(Joi.string()).label("Interests"),
  certificates: Joi.array().items(Joi.object()).label("Certificates"),
  kycDocuments: Joi.array().items(Joi.object()).label("KYC Documents"),

  meetingLink: Joi.string().trim().allow("").label("Meeting Link"),

  address: Joi.string().trim().allow("").label("Address"),
  locality: Joi.string().trim().allow("").label("Locality"),
  city: Joi.string().trim().allow("").label("City"),
  state: Joi.string().trim().allow("").label("State"),
  country: Joi.string().trim().allow("").label("Country"),
  pincode: Joi.string().trim().allow("").label("Pincode"),
  facebook: Joi.string().trim().allow("").label("Facebook"),
  instagram: Joi.string().trim().allow("").label("Instagram"),
  x: Joi.string().trim().allow("").label("X"),
  youtube: Joi.string().trim().allow("").label("Youtube"),
  linkedin: Joi.string().trim().allow("").label("Linkedin"),

  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&@? "])[a-zA-Z0-9!#$%&@?]{6,20}$/
    )
    .allow("")
    .min(6)
    .messages({
      "string.empty": `"Password" must not be empty`,
      "string.pattern.base": `"Pasword" must be a mix of number, char, and special char`,
    })
    .label("Password"),
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

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
