const router = require("express").Router();
const productReviewController = require("../controllers/productReviewController");
const productReviewValidationSchema = require("../apiValidationSchemas/productReviewValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productReviewValidationSchema.create),
  productReviewController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(productReviewValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  productReviewController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(productReviewValidationSchema.findAll),
  productReviewController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(productReviewValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productReviewValidationSchema.update),
  productReviewController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(productReviewValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productReviewValidationSchema.findById),
  productReviewController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    productReviewValidationSchema.deleteMultiple
  ),
  productReviewController.deleteMultiple
);

module.exports = router;
