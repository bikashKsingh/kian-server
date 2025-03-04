const finishModel = require("../database/models/finishModel");
const { serviceResponse, finishMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check shortName is already exist or not
    const isExist = await finishModel.findOne({
      shortName: serviceData.shortName,
    });

    // already exists
    if (isExist) {
      response.errors = {
        shortName: finishMessage.ALREADY_EXISTS,
      };
      response.message = finishMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new finishModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = finishMessage.CREATED;
    } else {
      response.message = finishMessage.NOT_CREATED;
      response.errors.error = finishMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : finishService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await finishModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = finishMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = finishMessage.NOT_AVAILABLE;
      response.message = finishMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : finishService: findById, Error : ${error}`);
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
    const totalRecords = await finishModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await finishModel
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
      response.message = finishMessage.FETCHED;
    } else {
      response.message = finishMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : finishService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await finishModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = finishMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = finishMessage.NOT_UPDATED;
      response.errors.id = finishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : finishService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await finishModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await finishModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = finishMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = finishMessage.NOT_DELETED;
      response.errors.id = finishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : finishService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await finishModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await finishModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${finishMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = finishMessage.NOT_DELETED;
      response.errors.id = finishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : finishService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
