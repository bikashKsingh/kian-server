const userAddressModel = require("../database/models/userAddressModel");
const { serviceResponse, userAddressMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const newData = new userAddressModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = userAddressMessage.CREATED;
    } else {
      response.message = userAddressMessage.NOT_CREATED;
      response.errors.error = userAddressMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : userAddressService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await userAddressModel.findOne({
      _id: serviceData.id,
      user: serviceData.userId,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userAddressMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = userAddressMessage.NOT_AVAILABLE;
      response.message = userAddressMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : userAddressService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    let sortCondition = {};
    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = true,
      isDeleted = false,
      user = "",
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

    if (user) conditions.user = user;

    // count record
    const totalRecords = await userAddressModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await userAddressModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortCondition)
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = userAddressMessage.FETCHED;
    } else {
      response.message = userAddressMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : userAddressService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await userAddressModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userAddressMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = userAddressMessage.NOT_UPDATED;
      response.errors.id = userAddressMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : userAddressService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await userAddressModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await userAddressModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = userAddressMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = userAddressMessage.NOT_DELETED;
      response.errors.id = userAddressMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : userAddressService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await userAddressModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await userAddressModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${userAddressMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = userAddressMessage.NOT_DELETED;
      response.errors.id = userAddressMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : userAddressService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
