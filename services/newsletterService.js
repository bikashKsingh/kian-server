const newsletterModel = require("../database/models/newsletterModel");
const { serviceResponse, newsletterMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check email is already exist or not
    const isExist = await newsletterModel.findOne({
      email: serviceData.email,
    });

    // already exists
    if (isExist) {
      response.errors = {
        email: newsletterMessage.ALREADY_EXISTS,
      };
      response.message = newsletterMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new newsletterModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = newsletterMessage.CREATED;
    } else {
      response.message = newsletterMessage.NOT_CREATED;
      response.errors.error = newsletterMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : newsletterService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await newsletterModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = newsletterMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = newsletterMessage.NOT_AVAILABLE;
      response.message = newsletterMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : newsletterService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    const {
      limit = 10,
      page = 1,
      searchQuery,
      subscriptionStatus = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ email: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // subssubscriptionStatus
    if (subscriptionStatus == "ALL") {
      delete conditions.subscriptionStatus;
    } else {
      conditions.subscriptionStatus = subscriptionStatus;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await newsletterModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await newsletterModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = newsletterMessage.FETCHED;
    } else {
      response.message = newsletterMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : newsletterService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await newsletterModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = newsletterMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = newsletterMessage.NOT_UPDATED;
      response.errors.id = newsletterMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : newsletterService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await newsletterModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await newsletterModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = newsletterMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = newsletterMessage.NOT_DELETED;
      response.errors.id = newsletterMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : newsletterService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await newsletterModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await newsletterModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${newsletterMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = newsletterMessage.NOT_DELETED;
      response.errors.id = newsletterMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : newsletterService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
