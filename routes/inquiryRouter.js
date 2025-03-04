const router = require("express").Router();
const inquiryController = require("../controllers/inquiryController");
const inquiryValidationSchema = require("../apiValidationSchemas/inquiryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  joiSchemaValidation.validateBody(inquiryValidationSchema.create),
  inquiryController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(inquiryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  inquiryController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(inquiryValidationSchema.findAll),
  inquiryController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(inquiryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(inquiryValidationSchema.update),
  inquiryController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(inquiryValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(inquiryValidationSchema.findById),
  inquiryController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(inquiryValidationSchema.deleteMultiple),
  inquiryController.deleteMultiple
);

module.exports = router;
