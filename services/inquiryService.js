const inquiryModel = require("../database/models/inquiryModel");
const { serviceResponse, inquiryMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const newData = new inquiryModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = inquiryMessage.CREATED;
    } else {
      response.message = inquiryMessage.NOT_CREATED;
      response.errors.error = inquiryMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : inquiryService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await inquiryModel
      .findById({ _id: serviceData.id })
      .populate("product");
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = inquiryMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = inquiryMessage.NOT_AVAILABLE;
      response.message = inquiryMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : inquiryService: findById, Error : ${error}`);
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
      inquiryStatus = "ALL",
      inquiryType = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ email: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // subsinquiryStatus
    if (inquiryStatus == "ALL") {
      delete conditions.inquiryStatus;
    } else {
      conditions.inquiryStatus = inquiryStatus;
    }

    // subsinquiryType
    if (inquiryType == "ALL") {
      delete conditions.inquiryType;
    } else {
      conditions.inquiryType = inquiryType;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await inquiryModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await inquiryModel
      .find(conditions)
      .populate("product")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = inquiryMessage.FETCHED;
    } else {
      response.message = inquiryMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : inquiryService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await inquiryModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = inquiryMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = inquiryMessage.NOT_UPDATED;
      response.errors.id = inquiryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : inquiryService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await inquiryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await inquiryModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = inquiryMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = inquiryMessage.NOT_DELETED;
      response.errors.id = inquiryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : inquiryService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await inquiryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await inquiryModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${inquiryMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = inquiryMessage.NOT_DELETED;
      response.errors.id = inquiryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : inquiryService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
