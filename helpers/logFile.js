const fs = require("fs");
const moment = require("moment");

module.exports.write = function (errorMessage) {
  // Create a write stream (in append mode)
  const logStream = fs.createWriteStream("./logs/errors.log", {
    flags: "a",
  });

  const logEntry = `${moment(new Date()).format(
    "DD-MM-YYYY hh:mm:ss A"
  )}\nError - ${errorMessage}\n\n`;
  logStream.write(logEntry);
};
