const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const categoryValidationSchema = require("../apiValidationSchemas/categoryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.create),
  categoryController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.findById),
  categoryController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(categoryValidationSchema.findAll),
  categoryController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.update),
  categoryController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(categoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.findById),
  categoryController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(categoryValidationSchema.deleteMultiple),
  categoryController.deleteMultiple
);

module.exports = router;
