const router = require("express").Router();
const sizeController = require("../controllers/sizeController");
const sizeValidationSchema = require("../apiValidationSchemas/sizeValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeValidationSchema.create),
  sizeController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(sizeValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  sizeController.findById
);

// findAll
router.get(
  "/",
  // jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(sizeValidationSchema.findAll),
  sizeController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(sizeValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeValidationSchema.update),
  sizeController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(sizeValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeValidationSchema.findById),
  sizeController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(sizeValidationSchema.deleteMultiple),
  sizeController.deleteMultiple
);

module.exports = router;
