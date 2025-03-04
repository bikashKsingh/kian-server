const router = require("express").Router();
const trainerLevelController = require("../controllers/trainerLevelController");
const trainerLevelValidationSchema = require("../apiValidationSchemas/trainerLevelValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerLevelValidationSchema.create),
  trainerLevelController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(trainerLevelValidationSchema.findById),
  jwtValidation.validateAdminToken,
  trainerLevelController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(trainerLevelValidationSchema.findAll),
  trainerLevelController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(trainerLevelValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerLevelValidationSchema.update),
  trainerLevelController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(trainerLevelValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerLevelValidationSchema.findById),
  trainerLevelController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerLevelValidationSchema.deleteMultiple),
  trainerLevelController.deleteMultiple
);

module.exports = router;
