const trainerDesignationModel = require("../database/models/trainerDesignationModel");
const {
  serviceResponse,
  trainerDesignationMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await trainerDesignationModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: trainerDesignationMessage.ALREADY_EXISTS,
      };
      response.message = trainerDesignationMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new trainerDesignationModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = trainerDesignationMessage.CREATED;
    } else {
      response.message = trainerDesignationMessage.NOT_CREATED;
      response.errors.error = trainerDesignationMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: create, Error : ${error}`
    );
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerDesignationModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerDesignationMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = trainerDesignationMessage.NOT_AVAILABLE;
      response.message = trainerDesignationMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: findById, Error : ${error}`
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
    const totalRecords = await trainerDesignationModel.countDocuments(
      conditions
    );
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await trainerDesignationModel
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
      response.message = trainerDesignationMessage.FETCHED;
    } else {
      response.message = trainerDesignationMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: findAll, Error : ${error}`
    );

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await trainerDesignationModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerDesignationMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = trainerDesignationMessage.NOT_UPDATED;
      response.errors.id = trainerDesignationMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: update, Error : ${error}`
    );
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await trainerDesignationModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await trainerDesignationModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = trainerDesignationMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = trainerDesignationMessage.NOT_DELETED;
      response.errors.id = trainerDesignationMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: delete, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await trainerDesignationModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await trainerDesignationModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${trainerDesignationMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = trainerDesignationMessage.NOT_DELETED;
      response.errors.id = trainerDesignationMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerDesignationService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
