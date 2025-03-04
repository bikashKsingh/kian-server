// const documentFormatService = require("../services/documentFormatService");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");
const logFile = require("../helpers/logFile");
const fs = require("fs").promises; // Use the promises API for async/await

const path = require("path");

// Define the absolute path to the uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads"); // Base directory

// create
module.exports.create = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const files = req?.files?.map((file) => {
      return {
        ...file,
        filepath: `${process.env.SERVER_URL}/${file.destination}${file.filename}`,
      };
    });

    response.body = files;
    response.status = 200;

    // const serviceResponse = await documentFormatService.create(req.body);
    // if (serviceResponse.isOkay) {
    //   response.body = serviceResponse.body;
    //   response.status = 200;
    // } else {
    //   response.errors = serviceResponse.errors;
    // }
    // response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: fileUploadingController: create, Error : ${error}`
    );

    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// // findById
// module.exports.findById = async (req, res) => {
//   const response = _.cloneDeep(defaultServerResponse);
//   try {
//     const serviceResponse = await documentFormatService.findById(req.params);
//     if (serviceResponse.isOkay) {
//       response.body = serviceResponse.body;
//       response.status = 200;
//     } else {
//       response.errors = serviceResponse.errors;
//     }
//     response.message = serviceResponse.message;
//   } catch (error) {
//     logFile.write(
//       `Controller: fileUploadingController: findById, Error : ${error}`
//     );
//     response.message = error.message;
//   }
//   res.status(response.status).send(response);
// };

// // findAll
// module.exports.findAll = async (req, res) => {
//   const response = _.cloneDeep(defaultServerResponse);
//   try {
//     const serviceResponse = await documentFormatService.findAll(req.query);
//     if (serviceResponse.isOkay) {
//       response.body = serviceResponse.body;
//       response.page = serviceResponse.page;
//       response.totalPages = serviceResponse.totalPages;
//       response.totalRecords = serviceResponse.totalRecords;

//       response.status = 200;
//     } else {
//       response.errors = serviceResponse.errors;
//     }
//     response.message = serviceResponse.message;
//   } catch (error) {
//     logFile.write(
//       `Controller: fileUploadingController: findAll, Error : ${error}`
//     );
//     response.message = error.message;
//   }
//   res.status(response.status).send(response);
// };

// // update
// module.exports.update = async (req, res) => {
//   const response = _.cloneDeep(defaultServerResponse);
//   try {
//     const serviceResponse = await documentFormatService.update({
//       id: req.params.id,
//       body: req.body,
//     });

//     if (serviceResponse.isOkay) {
//       response.body = serviceResponse.body;
//       response.status = 200;
//     } else {
//       response.errors = serviceResponse.errors;
//     }

//     response.message = serviceResponse.message;
//   } catch (error) {
//     logFile.write(
//       `Controller: fileUploadingController: update, Error : ${error}`
//     );
//     response.message = error.message;
//   }
//   res.status(response.status).send(response);
// };

// // delete
module.exports.delete = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const { filename } = req.params;

    // Path to the file
    const filePath = path.join(UPLOADS_DIR, filename);

    // Check if the file exists using fs.promises.access()
    await fs.access(filePath);

    // If the file exists, delete it using fs.promises.unlink()
    await fs.unlink(filePath);
    response.message = `File ${filename} deleted successfully.`;
    response.status = 200;
  } catch (error) {
    logFile.write(
      `Controller: fileUploadingController: delete, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// // deleteMultiple
// module.exports.deleteMultiple = async (req, res) => {
//   const response = _.cloneDeep(defaultServerResponse);
//   try {
//     const serviceResponse = await documentFormatService.deleteMultiple(
//       req.body
//     );
//     if (serviceResponse.isOkay) {
//       response.body = serviceResponse.body;
//       response.status = 200;
//     } else {
//       response.errors = serviceResponse.errors;
//     }
//     response.message = serviceResponse.message;
//   } catch (error) {
//     logFile.write(
//       `Controller: fileUploadingController: deleteMultiple, Error : ${error}`
//     );
//     response.message = error.message;
//   }
//   res.status(response.status).send(response);
// };
