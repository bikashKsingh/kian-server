const programPlanModel = require("../database/models/programPlanModel");
const { serviceResponse, programPlanMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await programPlanModel.findOne({
      program: serviceData.program,
      plan: serviceData.plan,
    });

    // already exists
    if (isExist) {
      response.errors = {
        plan: programPlanMessage.ALREADY_EXISTS,
      };
      response.message = programPlanMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new programPlanModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = programPlanMessage.CREATED;
    } else {
      response.message = programPlanMessage.NOT_CREATED;
      response.errors.error = programPlanMessage.NOT_CREATED;
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
    const result = await programPlanModel
      .findById({ _id: serviceData.id })
      .populate({ path: "program" })
      .populate({ path: "plan" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programPlanMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = programPlanMessage.NOT_AVAILABLE;
      response.message = programPlanMessage.NOT_AVAILABLE;
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
      program,
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

    if (program) conditions.program = program;

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await programPlanModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await programPlanModel
      .find(conditions)
      .populate({ path: "program" })
      .populate({ path: "plan" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = programPlanMessage.FETCHED;
    } else {
      response.message = programPlanMessage.NOT_FETCHED;
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

    const result = await programPlanModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programPlanMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = programPlanMessage.NOT_UPDATED;
      response.errors.id = programPlanMessage.INVALID_ID;
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
    // const result = await programPlanModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await programPlanModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = programPlanMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = programPlanMessage.NOT_DELETED;
      response.errors.id = programPlanMessage.INVALID_ID;
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
    // const result = await programPlanModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await programPlanModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${programPlanMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = programPlanMessage.NOT_DELETED;
      response.errors.id = programPlanMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : planService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
