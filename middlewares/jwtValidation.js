const constant = require("../constants/message");
const jwt = require("jsonwebtoken");

// validateAdminToken
module.exports.validateAdminToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);

    req.params.adminId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateAdminResetPasswordToken
module.exports.validateAdminResetPasswordToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_ADMIN_RESET_SECRET_KEY
    );

    req.params.adminId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateUserToken
module.exports.validateUserToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const response = { ...constant.defaultServerResponse };

  try {
    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    } else if (authorization == "Bearer") {
      throw new Error(constant.validationMessage.LOGIN_NEEDED);
    }

    // decode the token
    const token = authorization.split("Bearer ")[1];

    const decodeToken = jwt.verify(
      token,
      process.env.JWT_USER_SECRET_KEY || "codescroller"
    );

    req.params.userId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateUserVerifyAccountToken
module.exports.validateUserVerifyAccountToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_USER_VERIFY_ACCOUNT_SECRET_KEY
    );

    req.params.userId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateUserResetPasswordToken
module.exports.validateUserResetPasswordToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_USER_PASSWORD_RESET_SECRET_KEY
    );

    req.params.userId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateTrainerToken
module.exports.validateTrainerToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(token, process.env.JWT_TRAINER_SECRET_KEY);

    req.params.adminId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};

// validateTrainerResetPasswordToken
module.exports.validateTrainerResetPasswordToken = (req, res, next) => {
  const response = { ...constant.defaultServerResponse };

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error(constant.validationMessage.TOKEN_MISSING);
    }
    // decode the token
    const token = authorization.split("Bearer ")[1];
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_TRAINER_RESET_SECRET_KEY
    );

    req.params.adminId = decodeToken.id;
    next();
  } catch (error) {
    response.status = 403;
    response.message = error.message;
    return res.status(response.status).send(response);
  }
};
