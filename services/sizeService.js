const sizeModel = require("../database/models/sizeModel");
const { serviceResponse, sizeMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await sizeModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: sizeMessage.ALREADY_EXISTS,
      };
      response.message = sizeMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new sizeModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = sizeMessage.CREATED;
    } else {
      response.message = sizeMessage.NOT_CREATED;
      response.errors.error = sizeMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : sizeService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await sizeModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = sizeMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = sizeMessage.NOT_AVAILABLE;
      response.message = sizeMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : sizeService: findById, Error : ${error}`);
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
    const totalRecords = await sizeModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await sizeModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = sizeMessage.FETCHED;
    } else {
      response.message = sizeMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : sizeService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await sizeModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = sizeMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = sizeMessage.NOT_UPDATED;
      response.errors.id = sizeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : sizeService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await sizeModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await sizeModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = sizeMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = sizeMessage.NOT_DELETED;
      response.errors.id = sizeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : sizeService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await sizeModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await sizeModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${sizeMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = sizeMessage.NOT_DELETED;
      response.errors.id = sizeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : sizeService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
