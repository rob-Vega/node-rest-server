const mongoose = require("mongoose");
require("colors");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
  } catch (error) {
    console.log(error);
    throw new Error("error!!!".red);
  }

  console.log("DB online".bgGreen);
};

module.exports = {
  dbConnection,
};
