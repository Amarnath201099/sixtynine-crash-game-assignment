const express = require("express");

const router = express.Router();

const createPlayer = require("../controllers/player.controller");

router.post("/", createPlayer);

module.exports = router;
