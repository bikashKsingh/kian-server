const router = require("express").Router();
const productController = require("../controllers/productController");
const productValidationSchema = require("../apiValidationSchemas/productValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productValidationSchema.create),
  productController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  productController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateQuery(productValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  productController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productValidationSchema.update),
  productController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(productValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productValidationSchema.findById),
  productController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(productValidationSchema.deleteMultiple),
  productController.deleteMultiple
);

module.exports = router;
