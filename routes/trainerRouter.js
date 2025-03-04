const express = require("express");
const trainerController = require("../controllers/trainerController");
const trainerValidationSchema = require("../apiValidationSchemas/trainerValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");
const router = express.Router();

/*
| Trainer Section |
*/

// login
router.post(
  "/login",
  joiSchemaValidation.validateBody(trainerValidationSchema.login),
  trainerController.login
);

// findAccount
router.post(
  "/findAccount",
  joiSchemaValidation.validateBody(trainerValidationSchema.findAccount),
  trainerController.findAccount
);

// verifyOTP
router.post(
  "/verifyOtp",
  joiSchemaValidation.validateBody(trainerValidationSchema.verifyOtp),
  trainerController.verifyOtp
);

// findOne
// router.get(
//   "/profile",
//   jwtValidation.validateAdminToken,
//   trainerController.findOne
// );

// createNewPassword
router.put(
  "/createNewPassword",
  jwtValidation.validateTrainerResetPasswordToken,
  joiSchemaValidation.validateBody(trainerValidationSchema.createNewPassword),
  trainerController.createNewPassword
);

/*
| Admin Section |
*/

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerValidationSchema.create),
  trainerController.create
);

// update
router.put(
  "/:id",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerValidationSchema.update),
  trainerController.update
);

router.get(
  "/:id",
  joiSchemaValidation.validateParams(trainerValidationSchema.findById),
  jwtValidation.validateAdminToken,
  trainerController.findById
);

router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(trainerValidationSchema.findAll),
  trainerController.findAll
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(trainerValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerValidationSchema.findById),
  trainerController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerValidationSchema.deleteMultiple),
  trainerController.deleteMultiple
);

/*
  | End Admin Section |
*/

module.exports = router;
