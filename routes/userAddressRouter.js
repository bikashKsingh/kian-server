const router = require("express").Router();
const userAddressController = require("../controllers/userAddressController");
const userAddressValidationSchema = require("../apiValidationSchemas/userAddressValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(userAddressValidationSchema.create),
  userAddressController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(userAddressValidationSchema.findById),
  jwtValidation.validateUserToken,
  userAddressController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateQuery(userAddressValidationSchema.findAll),
  userAddressController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(userAddressValidationSchema.findById),
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(userAddressValidationSchema.update),
  userAddressController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(userAddressValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(userAddressValidationSchema.findById),
  userAddressController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(userAddressValidationSchema.deleteMultiple),
  userAddressController.deleteMultiple
);

module.exports = router;
