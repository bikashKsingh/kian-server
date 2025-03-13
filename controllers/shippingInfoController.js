const shippingInfoService = require("../services/shippingInfoService");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");
const logFile = require("../helpers/logFile");

// shippingInfo
module.exports.shippingInfo = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await shippingInfoService.shippingInfo(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      // response.page = serviceResponse.page;
      // response.totalPages = serviceResponse.totalPages;
      // response.totalRecords = serviceResponse.totalRecords;

      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: shippingInfoController: shippingInfo, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response.body);
};
