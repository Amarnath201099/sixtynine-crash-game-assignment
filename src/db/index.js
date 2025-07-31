const mongoose = require("mongoose");
const { startGameLoop } = require("../gameEngine");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    console.log("MongoDB connected:", connect.connection.host);

    // To prevent excessive round creation and MongoDB load during local development,
    // the game loop has been temporarily disabled.
    // To enable the full game functionality, simply uncomment the line below.

    // startGameLoop();
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
