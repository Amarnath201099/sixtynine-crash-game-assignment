const express = require("express");
const {
  updateBetDetails,
  updateBetCashOutDetails,
} = require("../controllers/bet.controller");

const router = express.Router();

router.post("/:playerId", updateBetDetails);

router.post("/cashout/:playerId", updateBetCashOutDetails);

module.exports = router;
