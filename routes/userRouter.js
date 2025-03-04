const express = require("express");
const userController = require("../controllers/userController");
const userValidationSchema = require("../apiValidationSchemas/userValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");
const router = express.Router();

// create
router.post(
  "/register",
  joiSchemaValidation.validateBody(userValidationSchema.create),
  userController.create
);

// verifyAccount
router.post(
  "/verifyAccount",
  jwtValidation.validateUserVerifyAccountToken,
  joiSchemaValidation.validateBody(userValidationSchema.verifyAccount),
  userController.verifyAccount
);

// login
router.post(
  "/login",
  joiSchemaValidation.validateBody(userValidationSchema.login),
  userController.login
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(userValidationSchema.findAccount),
  userController.findAccount
);

// verifyOTP
router.post(
  "/verifyOtp",
  joiSchemaValidation.validateBody(userValidationSchema.verifyOtp),
  userController.verifyOtp
);

// findOne
router.get("/profile", jwtValidation.validateUserToken, userController.findOne);

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateUserResetPasswordToken,
  joiSchemaValidation.validateBody(userValidationSchema.createNewPassword),
  userController.createNewPassword
);

// updateProfile
router.put(
  "/updateProfile",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(userValidationSchema.updateProfile),
  userController.updateProfile
);

// -------------- ADMIN SECTION --------------
// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(userValidationSchema.findById),
  jwtValidation.validateAdminToken,
  userController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(userValidationSchema.findAll),
  jwtValidation.validateAdminToken,
  userController.findAll
);

// update
router.put(
  "/:id",

  joiSchemaValidation.validateParams(userValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(userValidationSchema.update),
  userController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(userValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(userValidationSchema.findById),
  userController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(userValidationSchema.deleteMultiple),
  userController.deleteMultiple
);

// -------------- ADMIN SECTION END --------------

module.exports = router;
