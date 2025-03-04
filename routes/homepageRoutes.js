const router = require("express").Router();
const homepageController = require("../controllers/homepageController");
const homepageValidationSchema = require("../apiValidationSchemas/homepageValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(homepageValidationSchema.create),
  homepageController.create
);

// findOne
router.get("/", homepageController.findOne);

// delete
router.delete("/", jwtValidation.validateAdminToken, homepageController.delete);

module.exports = router;
