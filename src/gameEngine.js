const crypto = require("crypto"); // core module of node.js

const Round = require("../src/models/round.model");

let currentRound = null;

function getCurrentRoundId() {
  return currentRound._id;
}

// Inline sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//Fucntion to generate random crashpoint

function generateCrashPoint() {
  const seed = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  const h = parseInt(hash.slice(0, 8), 16);
  const maxCrash = 10000;
  const crash = (h % maxCrash) / 100 + 1; // 1.00x to 100.00x

  return { crashPoint: parseFloat(crash.toFixed(2)), seed, hash };
}

// Start new round every 10 seconds

async function startGameLoop() {
  while (true) {
    console.log("Starting new round...");

    // create crashpoint

    const { crashPoint, seed, hash } = generateCrashPoint();
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + 10000);

    const newRound = new Round({
      crashPoint: crashPoint,
      seed: seed,
      hash: hash,
      status: "running",
      startedAt: startedAt,
      endedAt: endedAt,
    });

    await newRound.save(); // Save round to DB;
    currentRound = newRound;

    // Run multipler loop for every 100ms
    let startTime = Date.now();
    const interval = setInterval(async () => {
      const timeElapsed = (Date.now() - startTime) / 1000; // in seconds

      // exponential growth formula
      const multiplier = 1.0024 ** (100 * timeElapsed); // tweak base/growth speed

      // If multiplier hits crash point, end round
      if (multiplier >= crashPoint) {
        clearInterval(interval);
        console.log(`CRASH at ${crashPoint}x`);

        // Update the round status to 'crashed'
        await Round.findByIdAndUpdate(currentRound._id, {
          status: "crashed",
          endedAt: new Date(),
        });

        // Wait a few seconds before starting the next round
        console.log("Waiting before next round...");
      }
    }, 100); // run every 100 milliseconds

    // Wait 10 seconds before next round
    await sleep(10000);

    //  OPTIONAL: Update round to "completed" after full duration ends
    const existingRound = await Round.findById(currentRound._id);

    if (
      existingRound.status !== "completed" &&
      existingRound.status !== "crashed"
    ) {
      await Round.findByIdAndUpdate(currentRound._id, {
        status: "completed",
        endedAt: new Date(),
      });
    }

    console.log("Round completed. Starting next...\n");
  }
}

module.exports = { startGameLoop, getCurrentRoundId };
