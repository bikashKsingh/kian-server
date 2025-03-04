const router = require("express").Router();
const decorSericsController = require("../controllers/decorSericsController");
const decorSeriesValidationSchema = require("../apiValidationSchemas/decorSeriesValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(decorSeriesValidationSchema.create),
  decorSericsController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(decorSeriesValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  decorSericsController.findById
);

// findAll
router.get(
  "/",
  // jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(decorSeriesValidationSchema.findAll),
  decorSericsController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(decorSeriesValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(decorSeriesValidationSchema.update),
  decorSericsController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(decorSeriesValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(decorSeriesValidationSchema.findById),
  decorSericsController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(decorSeriesValidationSchema.deleteMultiple),
  decorSericsController.deleteMultiple
);

module.exports = router;
