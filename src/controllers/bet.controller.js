const Bet = require("../models/bet.model");
const Round = require("../models/round.model");

const { getCurrentRoundId } = require("../gameEngine");
const { convertUSDToCrypto } = require("../utlis/currencyConverter");
const Transaction = require("../models/transaction.model");
const Wallet = require("../models/wallet.model");

const updateBetDetails = async (req, res) => {
  const { playerId } = req.params;
  const { usdAmount, currency } = req.body;

  const roundId = getCurrentRoundId();

  if (!roundId) {
    return res.status(400).json({ message: "No active round at present." });
  }

  const roundDetails = await Round.findById(roundId);
  if (!roundDetails || roundDetails.status !== "running") {
    return res
      .status(400)
      .json({ message: "Round in not active, please wait for next one." });
  }

  const currencyDetails = await convertUSDToCrypto({ usdAmount, currency });

  const cryptoAmount = currencyDetails.cryptoAmount;
  const priceAtBetTime = currencyDetails.priceAtBetTime;

  const placedAt = new Date();

  try {
    const newBet = new Bet({
      playerId,
      roundId,
      usdAmount,
      currency,
      cryptoAmount,
      priceAtBetTime,
      placedAt,
    });

    const savedBet = await newBet.save();

    const newTransaction = new Transaction({
      playerId,
      roundId,
      usdAmount,
      currency,
      cryptoAmount,
      priceAtBetTime,
      transactionType: "bet",
    });

    await newTransaction.save();

    const wallet = await Wallet.findOne({ playerId });

    if (!wallet || wallet.balance < usdAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Deduct balance
    wallet.balance -= usdAmount;
    await wallet.save();

    res
      .status(200)
      .json({ message: "Successfully placed the bet.", betDetails: savedBet });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to place bet !!!", error: error.message });
  }
};

const updateBetCashOutDetails = async (req, res) => {
  const { playerId } = req.params;

  try {
    // Find the latest bet that hasn't been cashed out
    const betDetails = await Bet.findOne({
      playerId,
      cashedOut: false,
    }).sort({ createdAt: -1 });

    if (!betDetails) {
      return res
        .status(404)
        .json({ message: "No active bet found for player." });
    }

    const { roundId, cryptoAmount, currency, usdAmount, priceAtBetTime } =
      betDetails;

    // Get round details
    const roundDetails = await Round.findById(roundId);

    if (!roundDetails || roundDetails.status === "waiting") {
      return res
        .status(400)
        .json({ message: "Round not yet started or invalid." });
    }

    const { crashPoint, endedAt } = roundDetails;

    // Check if player is trying to cashout *after* the crash
    if (roundDetails.status === "crashed") {
      return res
        .status(400)
        .json({ message: "Too late! Round already crashed." });
    }

    // Calculate cashout values
    const currentMultiplier = crashPoint;
    const payoutCrypto = cryptoAmount * currentMultiplier;
    const payoutUSD = payoutCrypto * priceAtBetTime;

    // Update bet as cashed out
    const updatedBet = await Bet.findByIdAndUpdate(
      betDetails._id,
      {
        cashoutMultiplier: currentMultiplier,
        cashoutTime: endedAt, //new Date(),
        payoutCrypto,
        payoutUSD,
        cashedOut: true,
      },
      { new: true }
    );

    const newTransaction = new Transaction({
      playerId,
      roundId,
      usdAmount: payoutUSD,
      currency,
      cryptoAmount: payoutCrypto,
      priceAtBetTime,
      transactionType: "cashout",
    });

    await newTransaction.save();

    // Fetch the player's wallet
    const wallet = await Wallet.findOne({ playerId });

    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for the player." });
    }

    // Update wallet balance
    wallet.balance += payoutUSD;
    await wallet.save();

    res.status(200).json({
      message: "Cashed out successfully!",
      betDetails: updatedBet,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to process cashout.", error: error.message });
  }
};

module.exports = { updateBetDetails, updateBetCashOutDetails };
