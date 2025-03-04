const router = require("express").Router();
const paymentSettingController = require("../controllers/paymentSettingController");
const paymentSettingValidationSchema = require("../apiValidationSchemas/paymentSettingValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(paymentSettingValidationSchema.create),
  paymentSettingController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(paymentSettingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  paymentSettingController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(paymentSettingValidationSchema.findAll),
  paymentSettingController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(paymentSettingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(paymentSettingValidationSchema.update),
  paymentSettingController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(paymentSettingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(paymentSettingValidationSchema.findById),
  paymentSettingController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    paymentSettingValidationSchema.deleteMultiple
  ),
  paymentSettingController.deleteMultiple
);

module.exports = router;
