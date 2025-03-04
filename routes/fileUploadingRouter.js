const router = require("express").Router();
const fileUploadingController = require("../controllers/fileUploadingController");
const fileValidationSchema = require("../apiValidationSchemas/fileValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// const {
//   upload,
//   validateFiles,
//   saveFiles,
// } = require("../middlewares/fileUploading");

const { upload } = require("../middlewares/fileUploading_");

// create
router.post(
  "/",
  // jwtValidation.validateAdminToken,
  // (req, res) => {
  //   console.log(req.files);
  //   console.log(req.body);
  // },
  // fileUploadingController.create
  upload.array("files", 10), // Store files in memory
  // validateFiles, // Validate the files before saving
  // saveFiles, // Save the files manually after validation
  fileUploadingController.create
);

// // findById
// router.get(
//   "/:id",
//   joiSchemaValidation.validateParams(fileValidationSchema.findById),
//   jwtValidation.validateAdminToken,
//   fileUploadingController.findById
// );

// // findAll
// router.get(
//   "/",
//   jwtValidation.validateAdminToken,
//   joiSchemaValidation.validateQuery(fileValidationSchema.findAll),
//   fileUploadingController.findAll
// );

// // update
// router.put(
//   "/:id",
//   joiSchemaValidation.validateParams(fileValidationSchema.findById),
//   jwtValidation.validateAdminToken,
//   joiSchemaValidation.validateBody(fileValidationSchema.update),
//   fileUploadingController.update
// );

// // delete
router.delete(
  "/:filename",
  // joiSchemaValidation.validateParams(fileValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  // joiSchemaValidation.validateBody(fileValidationSchema.findById),
  fileUploadingController.delete
);

// // deleteMultiple
// router.delete(
//   "/",
//   jwtValidation.validateAdminToken,
//   joiSchemaValidation.validateBody(fileValidationSchema.deleteMultiple),
//   fileUploadingController.deleteMultiple
// );

module.exports = router;
