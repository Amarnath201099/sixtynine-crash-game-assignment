const Wallet = require("../models/wallet.model");

const playerWalletDetails = async (req, res) => {
  try {
    const { playerId } = req.params;

    const walletDetails = await Wallet.findOne({ playerId }).populate(
      "playerId",
      "username email"
    );

    if (!walletDetails) {
      return res.status(404).json({ message: "Player wallet not found in DB" });
    }

    const response = {
      username: walletDetails.playerId.username,
      email: walletDetails.playerId.email,
      balance: walletDetails.balance,
    };

    res.status(200).json({ walletDetails: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get wallet details", error: error.message });
  }
};

const createWallet = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { balance } = req.body;

    const newWallet = new Wallet({ playerId, balance: balance || 0 });
    const savedWallet = await newWallet.save();

    res
      .status(200)
      .json({ message: "Balance successfully added", wallet: savedWallet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add balance", error: error.message });
  }
};

module.exports = { playerWalletDetails, createWallet };
