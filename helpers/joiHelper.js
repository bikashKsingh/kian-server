const { checkMongoObject } = require("./dbHelper");
const constants = require("../constants/message");

module.exports.customCallback = (value, option) => {
  if (!checkMongoObject(value))
    return option.message(constants.databaseMessage.INVALID_ID);
  return true;
};
