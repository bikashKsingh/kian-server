const router = require("express").Router();
const orderController = require("../controllers/orderController");
const orderValidationSchema = require("../apiValidationSchemas/orderValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// ------------ USER SECTION --------------
// create
router.post(
  "/",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(orderValidationSchema.create),
  orderController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(orderValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  orderController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(orderValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  orderController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(orderValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(orderValidationSchema.update),
  orderController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(orderValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(orderValidationSchema.findById),
  orderController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(orderValidationSchema.deleteMultiple),
  orderController.deleteMultiple
);

module.exports = router;
