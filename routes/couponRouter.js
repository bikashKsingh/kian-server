const router = require("express").Router();
const couponController = require("../controllers/couponController");
const couponValidationSchema = require("../apiValidationSchemas/couponValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(couponValidationSchema.create),
  couponController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(couponValidationSchema.findById),
  jwtValidation.validateAdminToken,
  couponController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(couponValidationSchema.findAll),
  couponController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(couponValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(couponValidationSchema.update),
  couponController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(couponValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(couponValidationSchema.findById),
  couponController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(couponValidationSchema.deleteMultiple),
  couponController.deleteMultiple
);

module.exports = router;
