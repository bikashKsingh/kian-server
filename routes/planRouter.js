const router = require("express").Router();
const planController = require("../controllers/planController");
const planValidationSchema = require("../apiValidationSchemas/planValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(planValidationSchema.create),
  planController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(planValidationSchema.findById),
  jwtValidation.validateAdminToken,
  planController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(planValidationSchema.findAll),
  jwtValidation.validateAdminToken,
  planController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(planValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(planValidationSchema.update),
  planController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(planValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(planValidationSchema.findById),
  planController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(planValidationSchema.deleteMultiple),
  planController.deleteMultiple
);

module.exports = router;
