const express = require("express");
const adminController = require("../controllers/adminController");
const adminValidationSchema = require("../apiValidationSchemas/adminValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");
const router = express.Router();

// create
router.post(
  "/register",
  joiSchemaValidation.validateBody(adminValidationSchema.create),
  adminController.create
);

// login
router.post(
  "/login",
  joiSchemaValidation.validateBody(adminValidationSchema.login),
  adminController.login
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(adminValidationSchema.findAccount),
  adminController.findAccount
);

// verifyOTP
router.post(
  "/verifyOtp",
  joiSchemaValidation.validateBody(adminValidationSchema.verifyOtp),
  adminController.verifyOtp
);

// findOne
router.get(
  "/profile",
  jwtValidation.validateAdminToken,
  adminController.findOne
);

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateAdminResetPasswordToken,
  joiSchemaValidation.validateBody(adminValidationSchema.createNewPassword),
  adminController.createNewPassword
);

// update
router.put(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(adminValidationSchema.update),
  adminController.update
);

module.exports = router;
