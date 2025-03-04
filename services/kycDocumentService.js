const kycDocumentModel = require("../database/models/kycDocumentModel");
const { serviceResponse, kycDocumentMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await kycDocumentModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: kycDocumentMessage.ALREADY_EXISTS,
      };
      response.message = kycDocumentMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new kycDocumentModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = kycDocumentMessage.CREATED;
    } else {
      response.message = kycDocumentMessage.NOT_CREATED;
      response.errors.error = kycDocumentMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : kycDocumentService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await kycDocumentModel
      .findById({ _id: serviceData.id })
      .populate({ path: "formats" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = kycDocumentMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = kycDocumentMessage.NOT_AVAILABLE;
      response.message = kycDocumentMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : kycDocumentService: findById, Error : ${error}`);
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
    const totalRecords = await kycDocumentModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await kycDocumentModel
      .find(conditions)
      .populate({ path: "formats" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = kycDocumentMessage.FETCHED;
    } else {
      response.message = kycDocumentMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : kycDocumentService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await kycDocumentModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = kycDocumentMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = kycDocumentMessage.NOT_UPDATED;
      response.errors.id = kycDocumentMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : kycDocumentService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await kycDocumentModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await kycDocumentModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = kycDocumentMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = kycDocumentMessage.NOT_DELETED;
      response.errors.id = kycDocumentMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : kycDocumentService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await kycDocumentModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await kycDocumentModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${kycDocumentMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = kycDocumentMessage.NOT_DELETED;
      response.errors.id = kycDocumentMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : kycDocumentService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
