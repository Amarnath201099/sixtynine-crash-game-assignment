const express = require("express");

const router = express.Router();

const {
  playerWalletDetails,
  createWallet,
} = require("../controllers/wallet.controller");

router.get("/:playerId", playerWalletDetails);

router.post("/:playerId", createWallet);

module.exports = router;
