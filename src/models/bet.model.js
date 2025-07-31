const mongoose = require("mongoose");

const betSchema = mongoose.Schema(
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
    placedAt: {
      type: Date,
      required: true,
    },
    cashedOut: {
      type: Boolean,
      default: false,
    },
    cashoutMultiplier: {
      type: Number,
      default: null,
    },
    cashoutTime: {
      type: Date,
      default: null,
    },
    payoutCrypto: {
      type: Number,
      default: null,
    },
    payoutUSD: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const Bet = mongoose.model("Bet", betSchema);

module.exports = Bet;
