const paymentSettingModel = require("../database/models/paymentSettingModel");
const {
  serviceResponse,
  paymentSettingMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check payment is already exist or not
    const isExist = await paymentSettingModel.findOne({
      company: serviceData.company,
    });

    // already exists
    if (isExist) {
      response.errors = {
        company: paymentSettingMessage.ALREADY_EXISTS,
      };
      response.message = paymentSettingMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new paymentSettingModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = paymentSettingMessage.CREATED;
    } else {
      response.message = paymentSettingMessage.NOT_CREATED;
      response.errors.error = paymentSettingMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : paymentSettingModel: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await paymentSettingModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = paymentSettingMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = paymentSettingMessage.NOT_AVAILABLE;
      response.message = paymentSettingMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : paymentSettingModel: findById, Error : ${error}`);
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
      status = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ title: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // status
    if (status == "ALL") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await paymentSettingModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await paymentSettingModel
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
      response.message = paymentSettingMessage.FETCHED;
    } else {
      response.message = paymentSettingMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : paymentSettingModel: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await paymentSettingModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = paymentSettingMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = paymentSettingMessage.NOT_UPDATED;
      response.errors.id = paymentSettingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : paymentSettingModel: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await paymentSettingModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await paymentSettingModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = paymentSettingMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = paymentSettingMessage.NOT_DELETED;
      response.errors.id = paymentSettingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : paymentSettingModel: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await paymentSettingModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await paymentSettingModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${paymentSettingMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = paymentSettingMessage.NOT_DELETED;
      response.errors.id = paymentSettingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : paymentSettingModel: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
