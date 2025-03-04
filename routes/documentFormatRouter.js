const router = require("express").Router();
const documentFormatController = require("../controllers/documentFormatController");
const documentFormatValidationSchema = require("../apiValidationSchemas/documentFormatValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(documentFormatValidationSchema.create),
  documentFormatController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(documentFormatValidationSchema.findById),
  jwtValidation.validateAdminToken,
  documentFormatController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(documentFormatValidationSchema.findAll),
  documentFormatController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(documentFormatValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(documentFormatValidationSchema.update),
  documentFormatController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(documentFormatValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(documentFormatValidationSchema.findById),
  documentFormatController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    documentFormatValidationSchema.deleteMultiple
  ),
  documentFormatController.deleteMultiple
);

module.exports = router;
