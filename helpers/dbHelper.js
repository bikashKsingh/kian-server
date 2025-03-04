const mongoose = require("mongoose");

// Format Mongodb Data
module.exports.formatMongoData = (values) => {
  if (!values) return values;

  if (Array.isArray(values)) {
    let formatData = [];
    for (value of values) {
      formatData.push(value.toObject());
    }
    return formatData;
  } else {
    return values.toObject();
  }
};

module.exports.checkMongoObject = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};
