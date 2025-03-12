const categoryModel = require("../database/models/categoryModel");
const { serviceResponse, categoryMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await categoryModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: categoryMessage.ALREADY_EXISTS,
      };
      response.message = categoryMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new categoryModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = categoryMessage.CREATED;
    } else {
      response.message = categoryMessage.NOT_CREATED;
      response.errors.error = categoryMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : categoryService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await categoryModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = categoryMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = categoryMessage.NOT_AVAILABLE;
      response.message = categoryMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : categoryService: findById, Error : ${error}`);
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
      priority = "",
      slug = "",
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

    if (priority) {
      sortCondition.priority = priority == "ASC" ? 1 : -1;
    }

    if (slug) conditions.slug = slug;

    // count record
    const totalRecords = await categoryModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await categoryModel
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
      response.message = categoryMessage.FETCHED;
    } else {
      response.message = categoryMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : categoryService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await categoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = categoryMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = categoryMessage.NOT_UPDATED;
      response.errors.id = categoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : categoryService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await categoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await categoryModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = categoryMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = categoryMessage.NOT_DELETED;
      response.errors.id = categoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : categoryService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await categoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await categoryModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${categoryMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = categoryMessage.NOT_DELETED;
      response.errors.id = categoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : categoryService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
