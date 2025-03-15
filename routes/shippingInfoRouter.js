const router = require("express").Router();
const shippingInfoController = require("../controllers/shippingInfoController");
const shippingInfoValidationSchema = require("../apiValidationSchemas/shippingInfoValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");

// shippingInfo
router.post(
  "/shipping-info",

  (req, res, next) => {
    console.log("Body", req.body);
    console.log("Query", req.query);
    console.log("Params", req.params);
    next();
  },

  joiSchemaValidation.validateBody(shippingInfoValidationSchema.shippingInfo),
  shippingInfoController.shippingInfo
);

module.exports = router;
