const decorSeriesModel = require("../database/models/decorSeriesModel");
const { serviceResponse, decorSeriesMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await decorSeriesModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: decorSeriesMessage.ALREADY_EXISTS,
      };
      response.message = decorSeriesMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new decorSeriesModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = decorSeriesMessage.CREATED;
    } else {
      response.message = decorSeriesMessage.NOT_CREATED;
      response.errors.error = decorSeriesMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : decorSeriesService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await decorSeriesModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = decorSeriesMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = decorSeriesMessage.NOT_AVAILABLE;
      response.message = decorSeriesMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : decorSeriesService: findById, Error : ${error}`);
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
    const totalRecords = await decorSeriesModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await decorSeriesModel
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
      response.message = decorSeriesMessage.FETCHED;
    } else {
      response.message = decorSeriesMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : decorSeriesService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await decorSeriesModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = decorSeriesMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = decorSeriesMessage.NOT_UPDATED;
      response.errors.id = decorSeriesMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : decorSeriesService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await decorSeriesModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await decorSeriesModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = decorSeriesMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = decorSeriesMessage.NOT_DELETED;
      response.errors.id = decorSeriesMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : decorSeriesService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await decorSeriesModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await decorSeriesModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${decorSeriesMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = decorSeriesMessage.NOT_DELETED;
      response.errors.id = decorSeriesMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : decorSeriesService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
