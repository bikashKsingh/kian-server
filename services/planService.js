const planModel = require("../database/models/planModel");
const { serviceResponse, planMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await planModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: planMessage.ALREADY_EXISTS,
      };
      response.message = planMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new planModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = planMessage.CREATED;
    } else {
      response.message = planMessage.NOT_CREATED;
      response.errors.error = planMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : planService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await planModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = planMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = planMessage.NOT_AVAILABLE;
      response.message = planMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : planService: findById, Error : ${error}`);
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
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await planModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await planModel
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
      response.message = planMessage.FETCHED;
    } else {
      response.message = planMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : planService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await planModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = planMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = planMessage.NOT_UPDATED;
      response.errors.id = planMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : planService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await planModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await planModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = planMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = planMessage.NOT_DELETED;
      response.errors.id = planMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : planService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await planModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await planModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${planMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = planMessage.NOT_DELETED;
      response.errors.id = planMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : planService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
