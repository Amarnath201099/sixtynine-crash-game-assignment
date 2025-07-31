const connectDB = require("./db");
const { app } = require("./app");

const dotenv = require("dotenv");

dotenv.config();

connectDB()
  .then(
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port", process.env.PORT);
    })
  )
  .catch((error) => {
    console.log("Error in server connection", error);
  });
