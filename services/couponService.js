const couponModel = require("../database/models/couponModel");
const { serviceResponse, couponMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check coupon is already exist or not
    const isExist = await couponModel.findOne({
      couponCode: serviceData.couponCode,
    });

    // already exists
    if (isExist) {
      response.errors = {
        couponCode: couponMessage.ALREADY_EXISTS,
      };
      response.message = couponMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new couponModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = couponMessage.CREATED;
    } else {
      response.message = couponMessage.NOT_CREATED;
      response.errors.error = couponMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : couponService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// getPromotions
module.exports.getPromotions = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const currentDate = new Date();
    let conditions = {
      couponStatus: "ACTIVE", // Assuming "active" is a value in COUPON_STATUS
      startDate: { $lte: currentDate }, // Start date is less than or equal to current date
      expiryDate: { $gte: currentDate }, // Expiry date is greater than or equal to current date
      isDeleted: false, // Ensure the coupon is not marked as deleted
    };
    const { order_id = 10, contact = 1, email } = serviceData;

    const result = await couponModel.find(conditions);

    let promotions = [];
    if (result) {
      for (let data of result) {
        let promotion = {
          code: data.couponCode,
          summary: data.description,
          description: data.description,
          tnc: ["Applicable for New Users", "Only 10% Off"],
        };

        promotions.push(promotion);
      }
    }

    if (result) {
      response.body = {
        promotions,
      };
      response.isOkay = true;
      response.page = 0;
      response.totalPages = 0;
      response.totalRecords = 0;
      response.message = couponMessage.FETCHED;
    } else {
      response.message = couponMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : couponService: getPromotions, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// applyPromotion
module.exports.applyPromotion = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const currentDate = new Date();
    let conditions = {
      couponStatus: "ACTIVE", // Assuming "active" is a value in COUPON_STATUS
      startDate: { $lte: currentDate }, // Start date is less than or equal to current date
      expiryDate: { $gte: currentDate }, // Expiry date is greater than or equal to current date
      isDeleted: false, // Ensure the coupon is not marked as deleted
    };
    const { order_id, contact, email, code } = serviceData;

    if (code) {
      conditions.couponCode = code;
    }

    const result = await couponModel.findOne(conditions);

    let promotion = {};

    if (result) {
      if (result.discountType == "AMOUNT") {
        promotion.value = result.discount;
      } else if (result.discountType == "PERCENTAGE") {
        // find by order id

        // need to code
        promotion.value = result.discount;
      }
      promotion.reference_id = result._id;
      promotion.type = "coupon";
      promotion.code = result.couponCode;
      promotion.description = result.description;

      response.body = {
        promotion,
      };

      response.isOkay = true;
      response.message = couponMessage.FETCHED;
    } else {
      response.message = couponMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : couponService: applyPromotion, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await couponModel
      .findById({ _id: serviceData.id })
      .populate({ path: "categories" })
      .populate({ path: "products" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = couponMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = couponMessage.NOT_AVAILABLE;
      response.message = couponMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : couponService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// validateCoupon
module.exports.validateCoupon = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const currentDate = new Date();

    let conditions = {
      couponCode: serviceData.couponCode,
      couponStatus: "ACTIVE", // Assuming "active" is a value in COUPON_STATUS
      startDate: { $lte: currentDate }, // Start date is less than or equal to current date
      expiryDate: { $gte: currentDate }, // Expiry date is greater than or equal to current date
      isDeleted: false, // Ensure the coupon is not marked as deleted
    };

    let subCondition = [];
    if (serviceData.plan) {
      subCondition.push({ plans: { $in: [serviceData.plan] } });
    }

    if (serviceData.category) {
      subCondition.push({ categories: { $in: [serviceData.category] } });
    }

    if (serviceData.program) {
      subCondition.push({ programs: { $in: [serviceData.program] } });
    }

    if (subCondition.length) {
      conditions.$and = subCondition;
    }

    const result = await couponModel.findOne(conditions);

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = couponMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.couponCode = couponMessage.NOT_AVAILABLE;
      response.message = couponMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : couponService: validateCoupon, Error : ${error}`);
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
      couponStatus = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ couponCode: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // subscouponStatus
    if (couponStatus == "ALL") {
      delete conditions.couponStatus;
    } else {
      conditions.couponStatus = couponStatus;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await couponModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await couponModel
      .find(conditions)
      .populate({ path: "categories" })
      .populate({ path: "products" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = couponMessage.FETCHED;
    } else {
      response.message = couponMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : couponService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await couponModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = couponMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = couponMessage.NOT_UPDATED;
      response.errors.id = couponMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : couponService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await couponModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await couponModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = couponMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = couponMessage.NOT_DELETED;
      response.errors.id = couponMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : couponService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await couponModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await couponModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${couponMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = couponMessage.NOT_DELETED;
      response.errors.id = couponMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : couponService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
