// const couponModel = require("../database/models/couponModel");
const {
  serviceResponse,
  shippingInfoMessage,
} = require("../constants/message");
// const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// shippingInfo
module.exports.shippingInfo = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const currentDate = new Date();
    let conditions = {};
    const { order_id, addresses = [] } = serviceData;

    // const result = await couponModel.find(conditions);

    let shippingDetails = [];

    for (let address of addresses) {
      let shipping = {
        id: address.id,
        zipcode: address.zipcode,
        state_code: address.state_code,
        state: address.state,
        country: address.country,

        shipping_methods: [
          {
            id: "1",
            description: "Free shipping",
            name: "Delivery within 5 days",
            serviceable: true,
            shipping_fee: 1000, // in paise. Here 1000 = 1000 paise, which equals to ₹10
            cod: true,
            cod_fee: 1000, // in paise. Here 1000 = 1000 paise, which equals to ₹10
          },
          {
            id: "2",
            description: "Standard Delivery",
            name: "Delivered on the same day",
            serviceable: true,
            shipping_fee: 1000, // in paise. Here 1000 = 1000 paise, which equals to ₹10
            cod: false,
            cod_fee: 0, // in paise. Here 1000 = 1000 paise, which equals to ₹10
          },
        ],

        serviceable: true, // required
        cod: true, // required
        cod_fee: 20, // required
        shipping_fee: 40, // required
      };

      shippingDetails.push(shipping);
    }

    response.body = {
      addresses: shippingDetails,
    };
    response.isOkay = true;
    // response.page = 0;
    // response.totalPages = 0;
    // response.totalRecords = 0;
    response.message = shippingInfoMessage.FETCHED;
  } catch (error) {
    logFile.write(
      `Service : shippingInfoService: shippingInfo, Error : ${error}`
    );

    throw new Error(error);
  }

  return response;
};
