const router = require("express").Router();
const kycDocumentContoller = require("../controllers/kycDocumentContoller");
const kycDocumentValidationSchema = require("../apiValidationSchemas/kycDocumentValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(kycDocumentValidationSchema.create),
  kycDocumentContoller.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(kycDocumentValidationSchema.findById),
  jwtValidation.validateAdminToken,
  kycDocumentContoller.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(kycDocumentValidationSchema.findAll),
  kycDocumentContoller.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(kycDocumentValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(kycDocumentValidationSchema.update),
  kycDocumentContoller.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(kycDocumentValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(kycDocumentValidationSchema.findById),
  kycDocumentContoller.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(kycDocumentValidationSchema.deleteMultiple),
  kycDocumentContoller.deleteMultiple
);

module.exports = router;
