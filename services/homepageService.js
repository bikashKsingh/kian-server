const homepageModel = require("../database/models/homepageModel");
const { serviceResponse, homepageMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check data is already exist or not
    const existingData = await homepageModel.findOne();

    // already exists
    if (existingData) {
      const result = await homepageModel.findOneAndUpdate(
        existingData._id,
        serviceData
      );
      if (result) {
        response.body = dbHelper.formatMongoData(result);
        response.isOkay = true;
        response.message = homepageMessage.UPDATED;
      } else {
        response.message = homepageMessage.NOT_UPDATED;
        response.errors.error = homepageMessage.NOT_UPDATED;
      }
    } else {
      const newData = new homepageModel(serviceData);
      const result = await newData.save();

      if (result) {
        response.body = dbHelper.formatMongoData(result);
        response.isOkay = true;
        response.message = homepageMessage.CREATED;
      } else {
        response.message = homepageMessage.NOT_CREATED;
        response.errors.error = homepageMessage.NOT_CREATED;
      }
    }
  } catch (error) {
    logFile.write(`Service : homepageService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findOne
module.exports.findOne = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await homepageModel.findOne();
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = homepageMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = homepageMessage.NOT_AVAILABLE;
      response.message = homepageMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : homepageService: findOne, Error : ${error}`);
    throw new Error(error);
  }
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await homepageModel.deleteMany();

    if (result) {
      response.message = homepageMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = homepageMessage.NOT_DELETED;
      response.errors.id = homepageMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : homepageService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
