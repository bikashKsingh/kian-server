const trainerService = require("../services/trainerService");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.create(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: create, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// login
module.exports.login = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.login(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: login, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findOne
module.exports.findOne = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.findOne(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: findOne, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findById
module.exports.findById = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.findById(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: findById, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAll
module.exports.findAll = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.findAll(req.query);
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
    logFile.write(`Controller: trainerController: findAll, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// update
module.exports.update = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.update({
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
    logFile.write(`Controller: trainerController: update, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAccount
module.exports.findAccount = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.findAccount(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;

    console.log(response);
  } catch (error) {
    console.log(
      `Somthing Went Wrong Controller: trainerController: findAccount`,
      error.message
    );
    logFile.write(
      `Controller: trainerController: findAccount, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// verifyOTP
module.exports.verifyOtp = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.verifyOtp(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: verifyOTP, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// createNewPassword
module.exports.createNewPassword = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.createNewPassword({
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
      `Controller: trainerController: createNewPassword, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// delete
module.exports.delete = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.delete(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: trainerController: delete, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteMultiple
module.exports.deleteMultiple = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await trainerService.deleteMultiple(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: trainerController: deleteMultiple, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
