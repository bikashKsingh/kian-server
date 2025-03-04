const router = require("express").Router();
const trainerDesignationController = require("../controllers/trainerDesignationController");
const trainerDesignationValidationSchema = require("../apiValidationSchemas/trainerDesignationValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerDesignationValidationSchema.create),
  trainerDesignationController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    trainerDesignationValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  trainerDesignationController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(trainerDesignationValidationSchema.findAll),
  trainerDesignationController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(
    trainerDesignationValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerDesignationValidationSchema.update),
  trainerDesignationController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(
    trainerDesignationValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerDesignationValidationSchema.findById),
  trainerDesignationController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    trainerDesignationValidationSchema.deleteMultiple
  ),
  trainerDesignationController.deleteMultiple
);

module.exports = router;
