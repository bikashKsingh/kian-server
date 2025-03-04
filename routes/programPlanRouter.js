const router = require("express").Router();
const programPlanController = require("../controllers/programPlanController");
const programPlanValidationSchema = require("../apiValidationSchemas/programPlanValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programPlanValidationSchema.create),
  programPlanController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(programPlanValidationSchema.findById),
  jwtValidation.validateAdminToken,
  programPlanController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(programPlanValidationSchema.findAll),
  jwtValidation.validateAdminToken,
  programPlanController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(programPlanValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programPlanValidationSchema.update),
  programPlanController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(programPlanValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programPlanValidationSchema.findById),
  programPlanController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programPlanValidationSchema.deleteMultiple),
  programPlanController.deleteMultiple
);

module.exports = router;
