const mongoose = require("mongoose");

const dbConnection = async (req, res) => {
  try {
    mongoose.set("strictQuery", true);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`tersambung ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnection;
