const adminModel = require("../database/models/adminModel");
const {
  serviceResponse,
  adminMessage,
  authMessage,
  validationMessage,
} = require("../constants/message");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbHelper = require("../helpers/dbHelper");
const smsHelper = require("../helpers/smsHelper");
const moment = require("moment");
const _ = require("lodash");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check Email is already exist or not
    const adminData = await adminModel.findOne({ email: serviceData.email });

    // already exists
    if (adminData) {
      response.errors = {
        email: adminMessage.EMAIL_EXISTS,
      };
      response.message = validationMessage.FAILED;
      return response;
    }

    const admin = new adminModel(serviceData);
    const result = await admin.save();

    if (result) {
      // generate jwt token
      const token = jwt.sign(
        { id: result._id },
        process.env.JWT_ADMIN_SECRET_KEY,
        { expiresIn: "2 days" }
      );
      const formatData = dbHelper.formatMongoData(result);
      response.body = { token };
      response.isOkay = true;
      response.message = adminMessage.CREATED;
    } else {
      response.message = adminMessage.NOT_CREATED;
      response.errors.error = adminMessage.NOT_CREATED;
    }
  } catch (error) {
    console.log(
      `Something went wrong Service: adminService: create`,
      error.message
    );
    throw new Error(error.message);
  }
  return response;
};

// login
module.exports.login = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Find admin
    const adminData = await adminModel.findOne({ email: serviceData.email });
    if (adminData) {
      // Check password is matched or not
      const isCorrect = await adminData.comparePassword(serviceData.password);
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: adminData._id },
          process.env.JWT_ADMIN_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        const formatData = adminData.toObject();
        response.body = { token };
        response.isOkay = true;
        response.message = adminMessage.LOGGED_IN;
      } else {
        response.errors.password = adminMessage.INVALID_PASSWORD;
        response.message = adminMessage.INVALID_PASSWORD;
      }
    } else {
      response.errors.email = adminMessage.INVALID_EMAIL;
      response.message = adminMessage.INVALID_EMAIL;
    }
  } catch (error) {
    console.log(`Something went wrong Service: adminService: login`);
    throw new Error(error.message);
  }
  return response;
};

// findOne
module.exports.findOne = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await adminModel.findOne({ _id: serviceData.adminId });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = adminMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = adminMessage.NOT_FOUND;
      response.message = adminMessage.NOT_FOUND;
    }
    return response;
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: adminService: getAdminProfile`,
      error.message
    );
    throw new Error(error);
  }
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { adminId, body } = serviceData;

    const adminData = await adminModel.findOne({ _id: adminId });

    // If Password available
    if (body.password) {
      if (!body.oldPassword) {
        response.errors.oldPassword = "Old Password is required";
        response.message = validationMessage.FAILED;
        return response;
      }
      const isCorrect = await adminData.comparePassword(body.oldPassword);

      if (isCorrect) {
        body.password = await adminData.hashPassword(body.password);
      } else {
        response.errors.oldPassword = authMessage.INVALID_PASSWORD;
        response.message = validationMessage.FAILED;
        return response;
      }
    }

    const result = await adminModel.findByIdAndUpdate(adminId, body, {
      new: true,
    });

    response.body = dbHelper.formatMongoData(result);
    response.message = adminMessage.UPDATED;
    response.isOkay = true;
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: adminService:  update`,
      error.message
    );
    throw new Error(error);
  }
  return response;
};

// findAccount
module.exports.findAccount = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    // Check Email exist or not
    const adminData = await adminModel.findOne({ email: serviceData.email });
    const otp = smsHelper.createOTP();
    if (adminData) {
      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: serviceData.email,
        subject: "Reset Password OTP",
        name: adminData.name,
        otp: otp,
      });

      if (!mailResponse.status) {
        response.message = `Account Found ! But some Error occured ${mailResponse.message}`;
        response.errors.email = `Account Found ! But some Error occured ${mailResponse.message}`;
      }

      // Save OTP To Database
      const date = moment.utc().toDate();
      const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

      const updateData = await adminModel.findByIdAndUpdate(adminData._id, {
        otp,
        otpExpiredAt,
      });

      if (updateData) {
        response.body = serviceData;
        response.message = adminMessage.FOUND;
        response.isOkay = true;
      } else {
        response.message = `Account Found but OTP Data Not Updated to Table`;
        response.errors.email = `Account Found but OTP Data Not Updated to Table`;
      }
    } else {
      response.errors.email = adminMessage.NOT_FOUND;
      response.message = adminMessage.NOT_FOUND;
    }
  } catch (error) {
    console.log(`Something went wrong Service: adminService: findAccount`);
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
    const adminData = await adminModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (adminData) {
      // generate token
      const token = jwt.sign(
        { id: adminData._id },
        process.env.JWT_ADMIN_RESET_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
      response.isOkay = true;
      response.message = adminMessage.OTP_VERIFIED;
    } else {
      response.errors.otp = adminMessage.OTP_EXPIRED;
      response.message = adminMessage.OTP_EXPIRED;
    }
  } catch (error) {
    console.log(`Something went wrong Service: adminService: verifyOTP`);
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

    const result = await adminModel.findOneAndUpdate(
      { _id: adminId },
      { password: password },
      {
        new: true,
      }
    );

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = adminMessage.PASSWORD_UPDATED;
      response.isOkay = true;
    } else {
      response.errors.password = adminMessage.PASSWORD_NOT_UPDATED;
      response.message = adminMessage.PASSWORD_NOT_UPDATED;
    }
  } catch (error) {
    console.log(
      `Somthing Went Wrong Service: adminService:  createNewPassword`,
      error.message
    );
    throw new Error(error);
  }

  return response;
};
