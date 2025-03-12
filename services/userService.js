const userModel = require("../database/models/userModel");
const {
  serviceResponse,
  userMessage,
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
// const bookingModel = require("../database/models/bookingModel");
const mongoose = require("mongoose");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check Mobile is already exist or not
    const userDataByMobile = await userModel.findOne({
      mobile: serviceData.mobile,
    });

    if (userDataByMobile) {
      response.errors = {
        mobile: userMessage.MOBILE_EXISTS,
      };
      response.message = userMessage.MOBILE_EXISTS;
      return response;
    }

    // Check Email is already exist or not
    const userData = await userModel.findOne({ email: serviceData.email });

    const otp = smsHelper.createOTP();
    // already exists
    if (userData) {
      if (userData.status) {
        response.errors = {
          email: userMessage.EMAIL_EXISTS,
        };
        response.message = userMessage.EMAIL_EXISTS;
        return response;
      } else {
        // Send Email
        const mailResponse = await smsHelper.sendOTPEmail({
          emailTo: userData.email,
          subject: "Account Verification OTP",
          name: userData.name,
          otp: otp,
        });

        if (!mailResponse.status) {
          response.message = `Account Created ! But some Error occured ${mailResponse.message}`;
          response.errors.email = `Account Created ! But some Error occured ${mailResponse.message}`;
          return response;
        }

        // Save OTP To Database
        const date = moment.utc().toDate();
        const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

        const updateData = await userModel.findByIdAndUpdate(userData._id, {
          otp,
          otpExpiredAt,
        });

        // generate jwt token
        const token = jwt.sign(
          { id: userData._id },
          process.env.JWT_USER_VERIFY_ACCOUNT_SECRET_KEY,
          { expiresIn: "3m" }
        );
        response.body = { token };
        response.isOkay = true;
        response.message = userMessage.CREATED;
        return response;
      }
    }

    const user = new userModel(serviceData);
    const result = await user.save();

    if (result) {
      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: result.email,
        subject: "Account Verification OTP",
        name: result.name,
        otp: otp,
      });

      if (!mailResponse.status) {
        response.message = `Account Created ! But some Error occured ${mailResponse.message}`;
        response.errors.email = `Account Created ! But some Error occured ${mailResponse.message}`;
        return response;
      }

      // Save OTP To Database
      const date = moment.utc().toDate();
      const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

      const updateData = await userModel.findByIdAndUpdate(result._id, {
        otp,
        otpExpiredAt,
      });

      // generate jwt token
      const token = jwt.sign(
        { id: result._id },
        process.env.JWT_USER_VERIFY_ACCOUNT_SECRET_KEY,
        { expiresIn: "3m" }
      );
      response.body = { token };
      response.isOkay = true;
      response.message = userMessage.CREATED;
    } else {
      response.message = userMessage.NOT_CREATED;
      response.errors.error = userMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : userService: create, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// verifyAccount
module.exports.verifyAccount = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  console.log(serviceData);
  try {
    // Verify Account
    const currentTime = new Date().toISOString();
    const userData = await userModel.findOne({
      _id: serviceData.userId,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (userData) {
      // generate token
      const token = jwt.sign(
        { id: userData._id },
        process.env.JWT_USER_SECRET_KEY,
        { expiresIn: "2 days" }
      );

      const result = await userModel.findByIdAndUpdate(userData._id, {
        status: true,
      });

      response.body = {
        token,
      };
      response.isOkay = true;
      response.message = userMessage.ACCOUNT_VERIFIED;
    } else {
      response.errors.otp = userMessage.OTP_EXPIRED;
      response.message = userMessage.OTP_EXPIRED;
    }
  } catch (error) {
    logFile.write(`Service : userService: verifyAccount, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// login
module.exports.login = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Find user
    const userData = await userModel.findOne({ email: serviceData.email });

    if (userData) {
      if (!userData.status) {
        response.errors.email = userMessage.INVALID_EMAIL;
        response.message = userMessage.INVALID_EMAIL;
        return response;
      }

      // Check password is matched or not
      const isCorrect = await userData.comparePassword(serviceData.password);
      if (isCorrect) {
        // Sign jwt token
        const token = jwt.sign(
          { id: userData._id },
          process.env.JWT_USER_SECRET_KEY,
          { expiresIn: "2 days" }
        );
        const formatData = userData.toObject();
        response.body = { token };
        response.isOkay = true;
        response.message = userMessage.LOGGED_IN;
      } else {
        response.errors.password = userMessage.INVALID_PASSWORD;
        response.message = userMessage.INVALID_PASSWORD;
      }
    } else {
      response.errors.email = userMessage.INVALID_EMAIL;
      response.message = userMessage.INVALID_EMAIL;
    }
  } catch (error) {
    logFile.write(`Service : userService: login, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// findOne
module.exports.findOne = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await userModel.findOne({ _id: serviceData.userId });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = userMessage.NOT_FOUND;
      response.message = userMessage.NOT_FOUND;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : userService: findOne, Error : ${error}`);
    throw new Error(error);
  }
};

// updateProfile
module.exports.updateProfile = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { userId, body } = serviceData;

    const userData = await userModel.findOne({ _id: userId });

    // If Password available
    if (body.password) {
      if (!body.oldPassword) {
        response.errors.oldPassword = "Old Password is required";
        response.message = validationMessage.FAILED;
        return response;
      }
      const isCorrect = await userData.comparePassword(body.oldPassword);

      if (isCorrect) {
        body.password = await userData.hashPassword(body.password);
      } else {
        response.errors.oldPassword = authMessage.INVALID_PASSWORD;
        response.message = validationMessage.FAILED;
        return response;
      }
    }

    const result = await userModel.findByIdAndUpdate(userId, body, {
      new: true,
    });

    response.body = dbHelper.formatMongoData(result);
    response.message = userMessage.UPDATED;
    response.isOkay = true;
  } catch (error) {
    logFile.write(`Service : userService: updateProfile, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// findAccount
module.exports.findAccount = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    // Check Email exist or not
    const userData = await userModel.findOne({ email: serviceData.email });
    const otp = smsHelper.createOTP();
    if (userData) {
      // Send Email
      const mailResponse = await smsHelper.sendOTPEmail({
        emailTo: serviceData.email,
        subject: "Reset Password OTP",
        name: userData.name,
        otp: otp,
      });

      if (!mailResponse.status) {
        response.message = `Account Found ! But some Error occured ${mailResponse.message}`;
        response.errors.email = `Account Found ! But some Error occured ${mailResponse.message}`;
        return response;
      }

      // Save OTP To Database
      const date = moment.utc().toDate();
      const otpExpiredAt = date.setMinutes(date.getMinutes() + 3);

      const updateData = await userModel.findByIdAndUpdate(userData._id, {
        otp,
        otpExpiredAt,
      });

      if (updateData) {
        response.body = serviceData;
        response.message = userMessage.FOUND;
        response.isOkay = true;
      } else {
        response.message = `Account Found but OTP Data Not Updated to Table`;
        response.errors.email = `Account Found but OTP Data Not Updated to Table`;
      }
    } else {
      response.errors.email = userMessage.NOT_FOUND;
      response.message = userMessage.NOT_FOUND;
    }
  } catch (error) {
    logFile.write(`Service : userService: findAccount, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// verifyOTP
module.exports.verifyOtp = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    // Verify OTP
    const currentTime = new Date().toISOString();
    const userData = await userModel.findOne({
      email: serviceData.email,
      otp: serviceData.otp,
      otpExpiredAt: { $gte: currentTime },
    });

    if (userData) {
      // generate token
      const token = jwt.sign(
        { id: userData._id },
        process.env.JWT_USER_PASSWORD_RESET_SECRET_KEY,
        { expiresIn: "3m" }
      );

      response.body = {
        token,
      };
      response.isOkay = true;
      response.message = userMessage.OTP_VERIFIED;
    } else {
      response.errors.otp = userMessage.OTP_EXPIRED;
      response.message = userMessage.OTP_EXPIRED;
    }
  } catch (error) {
    logFile.write(`Service : userService: verifyOtp, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// createNewPassword
module.exports.createNewPassword = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);

  try {
    const password = await bcryptjs.hash(serviceData.password, 12);
    const userId = serviceData.userId;

    const result = await userModel.findOneAndUpdate(
      { _id: userId },
      { password: password },
      {
        new: true,
      }
    );

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userMessage.PASSWORD_UPDATED;
      response.isOkay = true;
    } else {
      response.errors.password = userMessage.PASSWORD_NOT_UPDATED;
      response.message = userMessage.PASSWORD_NOT_UPDATED;
    }
  } catch (error) {
    logFile.write(`Service : userService: createNewPassword, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// -------------- ADMIN SECTION --------------
// dashboard
module.exports.dashboard = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    const { status = true, isDeleted = false } = serviceData;

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await userModel.countDocuments(conditions);

    // Get the first day of the current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // Get the first day of the next month and subtract one millisecond for the end of the current month
    const endOfMonth =
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) - 1;

    const currentMonthRecords = await userModel.countDocuments({
      ...conditions,
      createdAt: {
        $gte: startOfMonth,
        $lte: new Date(endOfMonth),
      },
    });

    // Get the start of last month
    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );

    // Get the end of last month
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 1) - 1;

    const lastMonthRecords = await userModel.countDocuments({
      createdAt: {
        $gte: startOfLastMonth,
        $lte: new Date(endOfLastMonth),
      },
    });

    let percentageChange;

    if (lastMonthRecords === 0) {
      if (currentMonthRecords === 0) {
        percentageChange = 0; // No change
      } else {
        percentageChange = 100; // Assume 100% increment when last month's sales are 0
      }
    } else {
      percentageChange =
        ((currentMonthRecords - lastMonthRecords) / lastMonthRecords) * 100;
    }

    response.body = {
      currentMonthRecords,
      lastMonthRecords,
      totalRecords,
      percentageChange,
    };
    response.isOkay = true;
    response.totalRecords = totalRecords;
    response.message = userMessage.FETCHED;
  } catch (error) {
    logFile.write(`Service : userService: dashboard, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await userModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = userMessage.NOT_FOUND;
      response.message = userMessage.NOT_FOUND;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : userService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
// module.exports.findAll = async (serviceData) => {
//   const response = _.cloneDeep(serviceResponse);
//   try {
//     let conditions = {};
//     const {
//       limit = 10,
//       page = 1,
//       searchQuery,
//       status = true,
//       isDeleted = false,
//     } = serviceData;

//     // SearchQuery
//     if (searchQuery) {
//       conditions = {
//         $or: [
//           { name: { $regex: searchQuery, $options: "i" } },
//           { email: { $regex: searchQuery, $options: "i" } },
//         ],
//       };
//     }

//     // Status
//     if (status == "All") {
//       delete conditions.status;
//     } else {
//       conditions.status = status;
//     }

//     // DeletedAccount
//     conditions.isDeleted = isDeleted;

//     // count record
//     const totalRecords = await userModel.countDocuments(conditions);
//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalRecords / parseInt(limit));

//     const result = await userModel
//       .find(conditions)
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .sort({ updatedAt: -1 })
//       .limit(parseInt(limit));

//     if (result) {
//       response.body = dbHelper.formatMongoData(result);
//       response.isOkay = true;
//       response.page = parseInt(page);
//       response.totalPages = totalPages;
//       response.totalRecords = totalRecords;
//       response.message = userMessage.FETCHED;
//     } else {
//       response.message = userMessage.NOT_FETCHED;
//     }
//   } catch (error) {
//     logFile.write(`Service : userService: findAll, Error : ${error}`);

//     throw new Error(error);
//   }

//   return response;
// };

module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = true,
      isDeleted = false,
    } = serviceData;

    // Search conditions for users
    let userConditions = {};

    if (searchQuery) {
      userConditions = {
        $or: [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status !== "All") {
      if (userConditions.status == "true") {
        userConditions.status = true;
      } else if (userConditions.status == "false") {
        userConditions.status = false;
      }
    }

    // Deleted Account
    userConditions.isDeleted = isDeleted;

    // Aggregation pipeline
    const usersWithOrders = await userModel.aggregate([
      { $match: userConditions }, // Filter users based on conditions
      {
        $lookup: {
          from: "orders", // Collection name of orders
          localField: "_id", // User `_id` in users collection
          foreignField: "user", // User reference in orders collection
          as: "orders", // Alias for the joined data
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" }, // Calculate the number of orders
        },
      },
      {
        $project: {
          orders: 0, // Exclude the orders array if not needed
        },
      },
      { $skip: (parseInt(page) - 1) * parseInt(limit) }, // Pagination
      { $limit: parseInt(limit) }, // Limit results
    ]);

    // Total record count for pagination
    const totalRecords = await userModel.countDocuments(userConditions);
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    if (usersWithOrders) {
      response.body = usersWithOrders;
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = userMessage.FETCHED;
    } else {
      response.message = userMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : userService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// trainersUser
// module.exports.trainersUser = async (serviceData) => {
//   const response = _.cloneDeep(serviceResponse);
//   try {
//     const {
//       limit = 10,
//       page = 1,
//       searchQuery,
//       status = true,
//       isDeleted = false,
//       trainerId,
//     } = serviceData;

//     // Search conditions for users
//     let userConditions = {};

//     // Deleted Account
//     userConditions.isDeleted = isDeleted;

//     // Step 1: Total count of records for pagination
//     const totalCountResult = await bookingModel.aggregate([
//       {
//         $match: {
//           trainer: new mongoose.Types.ObjectId(trainerId), // Match specific trainer ID
//           isDeleted: false, // Exclude deleted bookings if needed
//         },
//       },
//       {
//         $group: {
//           _id: "$user", // Group by distinct users
//         },
//       },
//       {
//         $count: "totalCount", // Count total distinct users
//       },
//     ]);

//     // Step 2: Aggregation for users with booking count and pagination
//     const usersWithBookings = await bookingModel.aggregate([
//       {
//         $match: {
//           trainer: new mongoose.Types.ObjectId(trainerId), // Match specific trainer ID
//           isDeleted: false, // Exclude deleted bookings if needed
//         },
//       },
//       {
//         $group: {
//           _id: "$user", // Group by user ID
//           totalBookings: { $sum: 1 }, // Count the number of bookings per user
//         },
//       },
//       {
//         $lookup: {
//           from: "users", // Assuming your user collection is named 'users'
//           localField: "_id", // User ID from bookings
//           foreignField: "_id", // User ID in the user collection
//           as: "userDetails", // Alias for the user data
//         },
//       },
//       {
//         $unwind: "$userDetails", // Flatten the userDetails array
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the default ID field
//           user: "$userDetails", // Include user details
//           totalBookings: 1, // Include booking count
//         },
//       },

//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ["$user", { totalBookings: "$totalBookings" }], // Merge userDetails and totalBookings
//           },
//         },
//       },

//       { $skip: (parseInt(page) - 1) * parseInt(limit) }, // Skip the required number of records
//       { $limit: parseInt(limit) }, // Limit the results to the specified number
//     ]);

//     // Total record count for pagination
//     const totalRecords =
//       totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
//     const totalPages = Math.ceil(totalRecords / parseInt(limit));

//     if (usersWithBookings) {
//       response.body = usersWithBookings;
//       response.isOkay = true;
//       response.page = parseInt(page);
//       response.totalPages = totalPages;
//       response.totalRecords = totalRecords;
//       response.message = userMessage.FETCHED;
//     } else {
//       response.message = userMessage.NOT_FETCHED;
//     }
//   } catch (error) {
//     logFile.write(`Service : userService: trainersUser, Error : ${error}`);

//     throw new Error(error);
//   }

//   return response;
// };

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await userModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = userMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = userMessage.NOT_UPDATED;
      response.errors.id = userMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : userService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await userModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await userModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = userMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = userMessage.NOT_DELETED;
      response.errors.id = userMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : userService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await userModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await userModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${userMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = userMessage.NOT_DELETED;
      response.errors.id = userMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : userService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// -------------- ADMIN SECTION END --------------
