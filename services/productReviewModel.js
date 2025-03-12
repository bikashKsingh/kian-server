const productReviewsModel = require("../database/models/productReviewsModel");
const {
  serviceResponse,
  productReviewMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const newData = new productReviewsModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = productReviewMessage.CREATED;
    } else {
      response.message = productReviewMessage.NOT_CREATED;
      response.errors.error = productReviewMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : productReviewService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await productReviewsModel
      .findById({
        _id: serviceData.id,
      })
      .populate({ path: "user", select: "firstName lastName email mobile" })
      .populate({ path: "product" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productReviewMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = productReviewMessage.NOT_AVAILABLE;
      response.message = productReviewMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : productReviewService: findById, Error : ${error}`);
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
        $or: [{ reviewText: { $regex: searchQuery, $options: "i" } }],
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
    const totalRecords = await productReviewsModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await productReviewsModel
      .find(conditions)
      .populate({ path: "user", select: "firstName lastName email mobile" })
      .populate({ path: "product" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = productReviewMessage.FETCHED;
    } else {
      response.message = productReviewMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : productReviewService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await productReviewsModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productReviewMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = productReviewMessage.NOT_UPDATED;
      response.errors.id = productReviewMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productReviewService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await productReviewsModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await productReviewsModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = productReviewMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = productReviewMessage.NOT_DELETED;
      response.errors.id = productReviewMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productReviewService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await productReviewsModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await productReviewsModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${productReviewMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = productReviewMessage.NOT_DELETED;
      response.errors.id = productReviewMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : productReviewService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
