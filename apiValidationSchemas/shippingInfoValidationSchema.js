const Joi = require("joi");

// shippingInfo
// module.exports.shippingInfo = Joi.object({
//   order_id: Joi.string().required().label("Order Id"),
//   razorpay_order_id: Joi.string().required().label("Razorpay Order Id"),
//   email: Joi.string().email().required().label("Email"),
//   contact: Joi.string().required().label("Contact"),
//   addresses: Joi.array()
//     .items(
//       Joi.object({
//         id: Joi.number().required().label("ID"),
//         zipcode: Joi.string().required().label("Zipcode"),
//         state: Joi.string().required().label("State"),
//         state_code: Joi.string().label("State Code"),
//         country: Joi.string().required().label("Country"),
//       })
//     )
//     .required()
//     .label("Addresses"),
// });

// shippingInfo
module.exports.shippingInfo = Joi.object({
  order_id: Joi.string().label("Order Id"),
  razorpay_order_id: Joi.string().allow("").label("Razorpay Order Id"),
  email: Joi.string().email().allow("").label("Email"),
  contact: Joi.string().allow("").label("Contact"),
  addresses: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().allow("").label("ID"),
        zipcode: Joi.string().allow("").label("Zipcode"),
        state: Joi.string().allow("").label("State"),
        state_code: Joi.string().allow("").label("State Code"),
        country: Joi.string().allow("").label("Country"),
      })
    )
    .label("Addresses"),
});
