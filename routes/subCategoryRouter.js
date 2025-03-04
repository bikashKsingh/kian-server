const router = require("express").Router();
const subCategoryController = require("../controllers/subCategoryController");
const subCategoryValidationSchema = require("../apiValidationSchemas/subCategoryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(subCategoryValidationSchema.create),
  subCategoryController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(subCategoryValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  subCategoryController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateQuery(subCategoryValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  subCategoryController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(subCategoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(subCategoryValidationSchema.update),
  subCategoryController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(subCategoryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(subCategoryValidationSchema.findById),
  subCategoryController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(subCategoryValidationSchema.deleteMultiple),
  subCategoryController.deleteMultiple
);

module.exports = router;
