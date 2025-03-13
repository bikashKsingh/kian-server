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

// createRazorpayOrder
router.post(
  "/create-razorpay-order",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(orderValidationSchema.create),
  orderController.createRazorpayOrder
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(orderValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  orderController.findAll
);

// findAll
router.get(
  "/userOrders",
  joiSchemaValidation.validateQuery(orderValidationSchema.findAll),
  jwtValidation.validateUserToken,
  orderController.findAll
);

// findById
router.get(
  "/userOrders/:id",
  joiSchemaValidation.validateParams(orderValidationSchema.findById),
  jwtValidation.validateUserToken,
  orderController.findById
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(orderValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  orderController.findById
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
