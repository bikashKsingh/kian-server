const router = require("express").Router();
const ingredientController = require("../controllers/ingredientController");
const ingredientValidationSchema = require("../apiValidationSchemas/ingredientValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(ingredientValidationSchema.create),
  ingredientController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(ingredientValidationSchema.findById),
  ingredientController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(ingredientValidationSchema.findAll),
  ingredientController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(ingredientValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(ingredientValidationSchema.update),
  ingredientController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(ingredientValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(ingredientValidationSchema.findById),
  ingredientController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(ingredientValidationSchema.deleteMultiple),
  ingredientController.deleteMultiple
);

module.exports = router;
