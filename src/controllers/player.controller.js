const Player = require("../models/player.model");

const createPlayer = async (req, res) => {
  try {
    const { username, email } = req.body;

    const newPlayer = new Player({ username, email });
    const savedPlayer = await newPlayer.save();

    res.status(201).json({
      message: "Player created successfully",
      player: savedPlayer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createPlayer;
