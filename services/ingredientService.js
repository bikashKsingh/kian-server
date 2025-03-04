const ingredientModel = require("../database/models/ingredientModel");
const { serviceResponse, ingredientMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await ingredientModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: ingredientMessage.ALREADY_EXISTS,
      };
      response.message = ingredientMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new ingredientModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = ingredientMessage.CREATED;
    } else {
      response.message = ingredientMessage.NOT_CREATED;
      response.errors.error = ingredientMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : ingredientService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await ingredientModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = ingredientMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = ingredientMessage.NOT_AVAILABLE;
      response.message = ingredientMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : ingredientService: findById, Error : ${error}`);
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
          { name: { $regex: searchQuery, $options: "i" } },
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
    const totalRecords = await ingredientModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await ingredientModel
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
      response.message = ingredientMessage.FETCHED;
    } else {
      response.message = ingredientMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : ingredientService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await ingredientModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = ingredientMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = ingredientMessage.NOT_UPDATED;
      response.errors.id = ingredientMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : ingredientService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await ingredientModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await ingredientModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = ingredientMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = ingredientMessage.NOT_DELETED;
      response.errors.id = ingredientMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : ingredientService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await ingredientModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await ingredientModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${ingredientMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = ingredientMessage.NOT_DELETED;
      response.errors.id = ingredientMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : ingredientService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
