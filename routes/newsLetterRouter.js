const router = require("express").Router();
const newsletterController = require("../controllers/newsletterController");
const newsletterValidationSchema = require("../apiValidationSchemas/newsletterValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(newsletterValidationSchema.create),
  newsletterController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(newsletterValidationSchema.findById),
  jwtValidation.validateAdminToken,
  newsletterController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(newsletterValidationSchema.findAll),
  newsletterController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(newsletterValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(newsletterValidationSchema.update),
  newsletterController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(newsletterValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(newsletterValidationSchema.findById),
  newsletterController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(newsletterValidationSchema.deleteMultiple),
  newsletterController.deleteMultiple
);

module.exports = router;
