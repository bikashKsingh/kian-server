const carouselModel = require("../database/models/carouselModel");
const { serviceResponse, carouselMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const newData = new carouselModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = carouselMessage.CREATED;
    } else {
      response.message = carouselMessage.NOT_CREATED;
      response.errors.error = carouselMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : carouselService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await carouselModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = carouselMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = carouselMessage.NOT_AVAILABLE;
      response.message = carouselMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : carouselService: findById, Error : ${error}`);
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
          { subTitle: { $regex: searchQuery, $options: "i" } },
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
    const totalRecords = await carouselModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await carouselModel
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
      response.message = carouselMessage.FETCHED;
    } else {
      response.message = carouselMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : carouselService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await carouselModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = carouselMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = carouselMessage.NOT_UPDATED;
      response.errors.id = carouselMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : carouselService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await carouselModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await carouselModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = carouselMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = carouselMessage.NOT_DELETED;
      response.errors.id = carouselMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : carouselService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await carouselModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await carouselModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${carouselMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = carouselMessage.NOT_DELETED;
      response.errors.id = carouselMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : carouselService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
