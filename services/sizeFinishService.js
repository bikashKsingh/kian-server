const sizeFinishModel = require("../database/models/sizeFinishModel");
const { serviceResponse, sizeFinishMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check size is already exist or not
    const isExist = await sizeFinishModel.findOne({
      size: serviceData.size,
    });

    // already exists
    if (isExist) {
      response.errors = {
        size: sizeFinishMessage.ALREADY_EXISTS,
      };
      response.message = sizeFinishMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new sizeFinishModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = sizeFinishMessage.CREATED;
    } else {
      response.message = sizeFinishMessage.NOT_CREATED;
      response.errors.error = sizeFinishMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : sizeFinishService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await sizeFinishModel
      .findById({
        _id: serviceData.id,
      })
      .populate({ path: "size" })
      .populate({ path: "finishes" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = sizeFinishMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = sizeFinishMessage.NOT_AVAILABLE;
      response.message = sizeFinishMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : sizeFinishService: findById, Error : ${error}`);
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
    const totalRecords = await sizeFinishModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await sizeFinishModel
      .find(conditions)
      .populate({ path: "size" })
      .populate({ path: "finishes" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = sizeFinishMessage.FETCHED;
    } else {
      response.message = sizeFinishMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : sizeFinishService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await sizeFinishModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = sizeFinishMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = sizeFinishMessage.NOT_UPDATED;
      response.errors.id = sizeFinishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : sizeFinishService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await sizeFinishModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await sizeFinishModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = sizeFinishMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = sizeFinishMessage.NOT_DELETED;
      response.errors.id = sizeFinishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : sizeFinishService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await sizeFinishModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await sizeFinishModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${sizeFinishMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = sizeFinishMessage.NOT_DELETED;
      response.errors.id = sizeFinishMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : sizeFinishService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
