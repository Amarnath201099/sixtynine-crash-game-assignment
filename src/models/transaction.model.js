const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    roundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },
    transactionType: {
      type: String,
      emun: ["bet", "cashout"],
      required: true,
    },
    usdAmount: {
      type: Number,
      required: true,
    },
    cryptoAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    priceAtBetTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
