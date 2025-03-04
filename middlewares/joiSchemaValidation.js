const constants = require("../constants/message");
const path = require("path");

// validateBody
module.exports.validateBody = (schema) => {
  return (req, res, next) => {
    const response = { ...constants.defaultServerResponse };
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const modifyError = {};

      error.details.map((value) => {
        modifyError[value.path.join(".")] = value.message;
      });

      // console.log(modifyError);
      response.message = constants.validationMessage.VALIDATION_FAILED;
      response.errors = modifyError;
      res.status(response.status).send(response);
    } else {
      return next();
    }
  };
};

// validateParams
module.exports.validateParams = (schema) => {
  return (req, res, next) => {
    const response = { ...constants.defaultServerResponse };
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const modifyError = {};
      error.details.map((value) => {
        modifyError[value.path.join(".")] = value.message;
      });

      response.message = constants.validationMessage.VALIDATION_FAILED;
      response.errors = modifyError;
      return res.status(response.status).send(response);
    } else {
      return next();
    }
  };
};

// validateQuery
module.exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const response = { ...constants.defaultServerResponse };
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const modifyError = {};
      error.details.map((value) => {
        modifyError[value.path[0]] = value.message;
      });
      response.message = constants.validationMessage.VALIDATION_FAILED;
      response.errors = modifyError;
      res.status(response.status).send(response);
    } else {
      return next();
    }
  };
};

// validateFiles
module.exports.validateFiles = (schema) => {
  return (req, res, next) => {
    const response = { ...constants.defaultServerResponse };

    const files = req.files;

    if (!files || files.length === 0) {
      response.errors.files = "Files is required feild";
      response.message = "Validation failed";
      return res.status(response.status).send(response);
    }

    // Create array of file metadata for validation (extension and size)
    const fileData = files.map((file) => ({
      extension: path.extname(file.originalname).substring(1).toLowerCase(), // Extract extension without "."
      size: file.size,
    }));

    const { error } = schema.validate(
      { files: fileData },
      { abortEarly: false }
    );
    if (error) {
      const modifyError = {};

      error.details.map((value) => {
        modifyError[value.path.join(".")] = value.message;
      });

      // console.log(modifyError);
      response.message = constants.validationMessage.VALIDATION_FAILED;
      response.errors = modifyError;
      res.status(response.status).send(response);
    } else {
      return next();
    }
  };
};
