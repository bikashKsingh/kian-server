const trainerLevelModel = require("../database/models/trainerLevelModel");
const {
  serviceResponse,
  trainerLevelMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await trainerLevelModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: trainerLevelMessage.ALREADY_EXISTS,
      };
      response.message = trainerLevelMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new trainerLevelModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = trainerLevelMessage.CREATED;
    } else {
      response.message = trainerLevelMessage.NOT_CREATED;
      response.errors.error = trainerLevelMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : trainerLevelService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerLevelModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerLevelMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = trainerLevelMessage.NOT_AVAILABLE;
      response.message = trainerLevelMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : trainerLevelService: findById, Error : ${error}`);
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
    const totalRecords = await trainerLevelModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await trainerLevelModel
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
      response.message = trainerLevelMessage.FETCHED;
    } else {
      response.message = trainerLevelMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : trainerLevelService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await trainerLevelModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerLevelMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = trainerLevelMessage.NOT_UPDATED;
      response.errors.id = trainerLevelMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerLevelService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await trainerLevelModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await trainerLevelModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = trainerLevelMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = trainerLevelMessage.NOT_DELETED;
      response.errors.id = trainerLevelMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerLevelService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await trainerLevelModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await trainerLevelModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${trainerLevelMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = trainerLevelMessage.NOT_DELETED;
      response.errors.id = trainerLevelMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerLevelService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
