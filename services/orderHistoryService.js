const orderHistoryModel = require("../database/models/orderHistoryModel");
const {
  serviceResponse,
  orderHistoryMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
// module.exports.create = async (serviceData) => {
//   const response = _.cloneDeep(serviceResponse);
//   try {
//     // Check title is already exist or not
//     const isExist = await orderHistoryModel.findOne({
//       title: serviceData.title,
//     });

//     // already exists
//     if (isExist) {
//       response.errors = {
//         title: orderHistoryMessage.ALREADY_EXISTS,
//       };
//       response.message = orderHistoryMessage.ALREADY_EXISTS;
//       return response;
//     }

//     const newData = new orderHistoryModel(serviceData);
//     const result = await newData.save();

//     if (result) {
//       response.body = dbHelper.formatMongoData(result);
//       response.isOkay = true;
//       response.message = orderHistoryMessage.CREATED;
//     } else {
//       response.message = orderHistoryMessage.NOT_CREATED;
//       response.errors.error = orderHistoryMessage.NOT_CREATED;
//     }
//   } catch (error) {
//     logFile.write(`Service : orderHistoryService: create, Error : ${error}`);
//     throw new Error(error.message);
//   }
//   return response;
// };

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await orderHistoryModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = orderHistoryMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = orderHistoryMessage.NOT_AVAILABLE;
      response.message = orderHistoryMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : orderHistoryService: findById, Error : ${error}`);
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
      order = "",
    } = serviceData;

    // SearchQuery
    // if (searchQuery) {
    //   conditions = {
    //     $or: [{ title: { $regex: searchQuery, $options: "i" } }],
    //   };
    // }

    // status
    if (status == "ALL") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    if (order) conditions.order = order;

    // count record
    const totalRecords = await orderHistoryModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await orderHistoryModel
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
      response.message = orderHistoryMessage.FETCHED;
    } else {
      response.message = orderHistoryMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : orderHistoryService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await orderHistoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = orderHistoryMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = orderHistoryMessage.NOT_UPDATED;
      response.errors.id = orderHistoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : orderHistoryService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await orderHistoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await orderHistoryModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = orderHistoryMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = orderHistoryMessage.NOT_DELETED;
      response.errors.id = orderHistoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : orderHistoryService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await orderHistoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await orderHistoryModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${orderHistoryMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = orderHistoryMessage.NOT_DELETED;
      response.errors.id = orderHistoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : orderHistoryService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
