const router = require("express").Router();
const sizeFinishController = require("../controllers/sizeFinishController");
const sizeFinishValidationSchema = require("../apiValidationSchemas/sizeFinishValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeFinishValidationSchema.create),
  sizeFinishController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(sizeFinishValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  sizeFinishController.findById
);

// findAll
router.get(
  "/",
  // jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(sizeFinishValidationSchema.findAll),
  sizeFinishController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(sizeFinishValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeFinishValidationSchema.update),
  sizeFinishController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(sizeFinishValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeFinishValidationSchema.findById),
  sizeFinishController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeFinishValidationSchema.deleteMultiple),
  sizeFinishController.deleteMultiple
);

module.exports = router;
