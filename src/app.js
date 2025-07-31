const express = require("express");
const cors = require("cors");
const playerRoute = require("../src/routes/player.routes");
const walletRoute = require("../src/routes/wallet.routes");
const betRoute = require("../src/routes/bet.routes");

const app = express();

app.use(cors());
app.use(express.json());

//Routes

app.use("/api/player", playerRoute);

app.use("/api/wallet", walletRoute);

app.use("/api/bet", betRoute);

module.exports = { app };
