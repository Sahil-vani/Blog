const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connection Successful : ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`Db is Not Connected ${error.message}`);
  }
};

module.exports = { connectDB };
