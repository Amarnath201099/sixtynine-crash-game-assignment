const mongoose = require("mongoose");

const roundSchema = mongoose.Schema(
  {
    crashPoint: {
      type: Number,
      required: true,
    },
    seed: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "running", "crashed", "completed"],
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Round = mongoose.model("Round", roundSchema);

module.exports = Round;
