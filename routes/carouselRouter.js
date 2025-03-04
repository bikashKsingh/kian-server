const router = require("express").Router();
const carouselController = require("../controllers/carouselController");
const carouselValidationSchema = require("../apiValidationSchemas/carouselValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(carouselValidationSchema.create),
  carouselController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(carouselValidationSchema.findById),
  carouselController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(carouselValidationSchema.findAll),
  carouselController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(carouselValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(carouselValidationSchema.update),
  carouselController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(carouselValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(carouselValidationSchema.findById),
  carouselController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(carouselValidationSchema.deleteMultiple),
  carouselController.deleteMultiple
);

module.exports = router;
