const userService = require("../services/userService");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.create(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: create, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// verifyAccount
module.exports.verifyAccount = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.verifyAccount({
      ...req.body,
      ...req.params,
    });
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: userController: verifyAccount, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// login
module.exports.login = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.login(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: login, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findOne
module.exports.findOne = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.findOne(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: findOne, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// updateProfile
module.exports.updateProfile = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.updateProfile({
      userId: req.params.userId,
      body: req.body,
    });
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: userController: updateProfile, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAccount
module.exports.findAccount = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.findAccount(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: findAccount, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// verifyOTP
module.exports.verifyOtp = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.verifyOtp(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: verifyOtp, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// createNewPassword
module.exports.createNewPassword = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.createNewPassword({
      ...req.body,
      ...req.params,
    });
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: userController: createNewPassword, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// -------------- ADMIN SECTION --------------
// dashboard
module.exports.dashboard = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.dashboard(req.query);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.totalRecords = serviceResponse.totalRecords;

      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: dashboard, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findById
module.exports.findById = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.findById(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: findById, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAll
module.exports.findAll = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);

  try {
    const serviceResponse = await userService.findAll(req.query);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.page = serviceResponse.page;
      response.totalPages = serviceResponse.totalPages;
      response.totalRecords = serviceResponse.totalRecords;

      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: findAll, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// trainersUser
// module.exports.trainersUser = async (req, res) => {
//   const response = _.cloneDeep(defaultServerResponse);

//   try {
//     const serviceResponse = await userService.trainersUser({
//       ...req.query,
//       ...req.params,
//     });
//     if (serviceResponse.isOkay) {
//       response.body = serviceResponse.body;
//       response.page = serviceResponse.page;
//       response.totalPages = serviceResponse.totalPages;
//       response.totalRecords = serviceResponse.totalRecords;

//       response.status = 200;
//     } else {
//       response.errors = serviceResponse.errors;
//     }
//     response.message = serviceResponse.message;
//   } catch (error) {
//     logFile.write(`Controller: userController: trainersUser, Error : ${error}`);
//     response.message = error.message;
//   }
//   res.status(response.status).send(response);
// };

// update
module.exports.update = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.update({
      id: req.params.id,
      body: req.body,
    });

    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: update, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// delete
module.exports.delete = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.delete(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: userController: delete, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteMultiple
module.exports.deleteMultiple = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await userService.deleteMultiple(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: userController: deleteMultiple, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// -------------- ADMIN SECTION END --------------
