const trainerModel = require("../database/models/trainerModel");
const {
  serviceResponse,
  trainerMessage,
  authMessage,
  validationMessage,
} = require("../constants/message");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbHelper = require("../helpers/dbHelper");
const smsHelper = require("../helpers/smsHelper");
const moment = require("moment");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check Email is already exist or not
    const isExists = await trainerModel.findOne({ email: serviceData.email });

    // already exists
    if (isExists) {
      response.errors = {
        email: trainerMessage.EMAIL_EXISTS,
      };
      response.message = validationMessage.FAILED;
      return response;
    }

    const admin = new trainerModel(serviceData);
    const result = await admin.save();

    if (result) {
      // generate jwt token
      const token = jwt.sign(
        { id: result._id },
        process.env.JWT_TRAINER_SECRET_KEY,
        { expiresIn: "2 days" }
      );
      const formatData = dbHelper.formatMongoData(result);
      response.body = { token };
      response.isOkay = true;
      response.message = trainerMessage.CREATED;
    } else {
      response.message = trainerMessage.NOT_CREATED;
      response.errors.error = trainerMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// login
module.exports.login = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Find admin
    const result = await trainerModel.findOne({ email: serviceData.email });
    if (result) {
      // Check password is matched or not
      const isCorrect = await result.comparePassword(serviceData.password);
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: result._id },
          process.env.JWT_TRAINER_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        const formatData = result.toObject();
        response.body = { token };
        response.isOkay = true;
        response.message = trainerMessage.LOGGED_IN;
      } else {
        response.errors.password = authMessage.INVALID_PASSWORD;
        response.message = authMessage.INVALID_PASSWORD;
      }
    } else {
      response.errors.email = authMessage.INVALID_EMAIL;
      response.message = authMessage.INVALID_EMAIL;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: login, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findOne
module.exports.findOne = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerModel.findOne({ _id: serviceData.adminId });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = trainerMessage.NOT_FOUND;
      response.message = trainerMessage.NOT_FOUND;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : trainerService: findOne, Error : ${error}`);
    throw new Error(error);
  }
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerModel
      .findById({ _id: serviceData.id })
      .populate({ path: "level" })
      .populate({ path: "interests" })
      .populate({ path: "specialities" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = trainerMessage.INVALID_ID;
      response.message = trainerMessage.INVALID_ID;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : trainerService: findById, Error : ${error}`);
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
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { bio: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // subscouponStatus
    if (status == "ALL") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await trainerModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await trainerModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate({ path: "level" })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = trainerMessage.FETCHED;
    } else {
      response.message = trainerMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: findAll, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    console.log(id, body);

    const trainerData = await trainerModel.findOne({ _id: id });

    // If Password available
    if (body.password) {
      // if (!body.oldPassword) {
      //   response.errors.oldPassword = "Old Password is required";
      //   response.message = validationMessage.FAILED;
      //   return response;
      // }
      // const isCorrect = await trainerData.comparePassword(body.oldPassword);

      // if (isCorrect) {
      //   body.password = await trainerData.hashPassword(body.password);
      // } else {
      //   response.errors.oldPassword = authMessage.INVALID_PASSWORD;
      //   response.message = validationMessage.FAILED;
      //   return response;
      // }
      body.password = await trainerData.hashPassword(body.password);
    }

    const result = await trainerModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    console.log(result);

    response.body = dbHelper.formatMongoData(result);
    response.message = trainerMessage.UPDATED;
    response.isOkay = true;
  } catch (error) {
    logFile.write(`Service : trainerService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// findAccount
module.exports.findAccount = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    // Check Email exist or not
    const trainerData = await trainerModel.findOne({
      email: serviceData.email,
    });
    const otp = smsHelper.createOTP();
    if (trainerData) {
      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: serviceData.email,
        subject: "Reset Password OTP",
        name: trainerData.name,
        otp: otp,
      });

      if (!mailResponse.status) {
        response.message = `Account Found ! But some Error occured ${mailResponse.message}`;
        response.errors.email = `Account Found ! But some Error occured ${mailResponse.message}`;
      }

      // Save OTP To Database
      const date = moment.utc().toDate();
      const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

      const updateData = await trainerModel.findByIdAndUpdate(trainerData._id, {
        otp,
        otpExpiredAt,
      });

      if (updateData) {
        response.body = serviceData;
        response.message = trainerMessage.FOUND;
        response.isOkay = true;
      } else {
        response.message = `Account Found but OTP Data Not Updated to Table`;
        response.errors.email = `Account Found but OTP Data Not Updated to Table`;
      }
    } else {
      response.errors.email = trainerMessage.NOT_FOUND;
      response.message = trainerMessage.NOT_FOUND;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: findAccount, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// verifyOTP
module.exports.verifyOtp = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    // Verify OTP
    const currentTime = new Date().toISOString();
    const trainerData = await trainerModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (trainerData) {
      // generate token
      const token = jwt.sign(
        { id: trainerData._id },
        process.env.JWT_TRAINER_RESET_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
      response.isOkay = true;
      response.message = trainerMessage.OTP_VERIFIED;
    } else {
      response.errors.otp = trainerMessage.OTP_EXPIRED;
      response.message = trainerMessage.OTP_EXPIRED;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: verifyOTP, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// createNewPassword
module.exports.createNewPassword = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    const password = await bcryptjs.hash(serviceData.password, 12);
    const adminId = serviceData.adminId;

    const result = await trainerModel.findOneAndUpdate(
      { _id: adminId },
      { password: password },
      {
        new: true,
      }
    );

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerMessage.PASSWORD_UPDATED;
      response.isOkay = true;
    } else {
      response.errors.password = trainerMessage.PASSWORD_NOT_UPDATED;
      response.message = trainerMessage.PASSWORD_NOT_UPDATED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerService: createNewPassword, Error : ${error}`
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
    // const result = await trainerModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await trainerModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = trainerMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = trainerMessage.NOT_DELETED;
      response.errors.id = trainerMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await trainerModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await trainerModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${trainerMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = trainerMessage.NOT_DELETED;
      response.errors.id = trainerMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
