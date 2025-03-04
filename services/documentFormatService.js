const documentFormatModel = require("../database/models/documentFormatModel");
const {
  serviceResponse,
  documentFormatMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check format is already exist or not
    const isExist = await documentFormatModel.findOne({
      format: serviceData.format,
    });

    // already exists
    if (isExist) {
      response.errors = {
        format: documentFormatMessage.ALREADY_EXISTS,
      };
      response.message = documentFormatMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new documentFormatModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = documentFormatMessage.CREATED;
    } else {
      response.message = documentFormatMessage.NOT_CREATED;
      response.errors.error = documentFormatMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : documentFormatService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await documentFormatModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = documentFormatMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = documentFormatMessage.NOT_AVAILABLE;
      response.message = documentFormatMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : documentFormatService: findById, Error : ${error}`
    );
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
      status = true,
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ format: { $regex: searchQuery, $options: "i" } }],
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
    const totalRecords = await documentFormatModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await documentFormatModel
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
      response.message = documentFormatMessage.FETCHED;
    } else {
      response.message = documentFormatMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : documentFormatService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await documentFormatModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = documentFormatMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = documentFormatMessage.NOT_UPDATED;
      response.errors.id = documentFormatMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : documentFormatService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await documentFormatModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await documentFormatModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = documentFormatMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = documentFormatMessage.NOT_DELETED;
      response.errors.id = documentFormatMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : documentFormatService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await documentFormatModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await documentFormatModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${documentFormatMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = documentFormatMessage.NOT_DELETED;
      response.errors.id = documentFormatMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : documentFormatService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
