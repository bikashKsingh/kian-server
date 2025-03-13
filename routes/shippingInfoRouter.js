const router = require("express").Router();
const shippingInfoController = require("../controllers/shippingInfoController");
const shippingInfoValidationSchema = require("../apiValidationSchemas/shippingInfoValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

// shippingInfo
router.post(
  "/shipping-info",
  joiSchemaValidation.validateBody(shippingInfoValidationSchema.shippingInfo),
  shippingInfoController.shippingInfo
);

module.exports = router;
