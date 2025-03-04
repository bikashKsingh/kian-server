const mongoose = require("mongoose");
const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Database connected successfully! \n --Host: ${conn.connection.host} \n --Database: ${conn.connection.name}`
    );
  } catch (error) {
    console.log(`Database connection Error :) ${error.message}`);
  }
};
module.exports = connection;
