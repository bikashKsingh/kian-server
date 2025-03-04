const router = require("express").Router();
const orderHistoryController = require("../controllers/orderHistoryController");
const orderHistoryValidationSchema = require("../apiValidationSchemas/orderHistoryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
// router.post(
//   "/",
//   jwtValidation.validateAdminToken,
//   joiSchemaValidation.validateBody(orderHistoryValidationSchema.create),
//   orderHistoryController.create
// );

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(orderHistoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  orderHistoryController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(orderHistoryValidationSchema.findAll),
  orderHistoryController.findAll
);

// update
// router.put(
//   "/:id",
//   joiSchemaValidation.validateParams(orderHistoryValidationSchema.findById),
//   jwtValidation.validateAdminToken,
//   joiSchemaValidation.validateBody(orderHistoryValidationSchema.update),
//   orderHistoryController.update
// );

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(orderHistoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(orderHistoryValidationSchema.findById),
  orderHistoryController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(orderHistoryValidationSchema.deleteMultiple),
  orderHistoryController.deleteMultiple
);

module.exports = router;
