const router = require("express").Router();
const finishController = require("../controllers/finishController");
const finishValidationSchema = require("../apiValidationSchemas/finishValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(finishValidationSchema.create),
  finishController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(finishValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  finishController.findById
);

// findAll
router.get(
  "/",
  // jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(finishValidationSchema.findAll),
  finishController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(finishValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(finishValidationSchema.update),
  finishController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(finishValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(finishValidationSchema.findById),
  finishController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(finishValidationSchema.deleteMultiple),
  finishController.deleteMultiple
);

module.exports = router;
