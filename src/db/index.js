const mongoose = require("mongoose");
const { startGameLoop } = require("../gameEngine");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    console.log("MongoDB connected:", connect.connection.host);
    // startGameLoop();
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
