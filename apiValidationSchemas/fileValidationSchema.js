const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

const extensions = ["png", "jpg", "pdf", "jpeg", "docx", "xlsx"];

// create
module.exports.create = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        extension: Joi.string()
          .valid(...extensions) // Validate against allowed extensions
          .required()
          .messages({
            "any.only": `Unsupported file extension. Allowed extensions are: ${extensions.join(
              ", "
            )}`,
          }),
        size: Joi.number()
          .max(1024 * 1024 * 2) // Max size of 2MB per file
          .required()
          .messages({
            "number.max": "File size must be less than or equal to 2MB.",
          }),
      })
    )
    .label("Files"),
});

// // findAll
// module.exports.findAll = Joi.object({
//   email: Joi.string().email(),
//   page: Joi.string(),
//   limit: Joi.string(),
//   searchQuery: Joi.string(),
//   subscriptionStatus: Joi.string().valid(...SUBSCRIPTION_STATUS, "ALL", ""),
// });

// // findById
// module.exports.findById = Joi.object({
//   id: Joi.custom(customCallback),
// });

// // update
// module.exports.update = Joi.object({
//   email: Joi.string().required().label("Email"),
//   subscriptionStatus: Joi.string().valid(...SUBSCRIPTION_STATUS, ""),
// });

// // deleteMultiple
// module.exports.deleteMultiple = Joi.object({
//   ids: Joi.array().items(Joi.custom(customCallback)).required(),
// });
