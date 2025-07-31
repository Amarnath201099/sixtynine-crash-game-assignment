# 🎮 Crypto Crash - Backend Game Engine

An online multiplayer crash betting game where users place bets in USD (converted to crypto) and try to cash out before the game crashes!

---

## 🚀 Features

- Multiplayer crash game logic.
- Real-time USD to Crypto (BTC/ETH) conversion using CoinGecko API.
- Provably fair crash algorithm.
- MongoDB-based storage for players, bets, rounds, transactions, and wallets.
- API for placing bets, cashouts, creating wallets, and checking balances.

---

## 📦 Tech Stack

- Node.js + Express.js
- MongoDB (via Mongoose)
- CoinGecko API (for crypto prices)
- Socket.IO (pending implementation)
- Render (for deployment)

---

## 🛠️ Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/Amarnath201099/sixtynine-crash-game-assignment.git
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set up Environment Variables

Create a .env file with the following content:

```bash
PORT=5000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net
DB_NAME=cryptoCrash
```

## 4. Run the Server

```bash
npm start
```

---

## 📌 Important Note

To avoid unnecessary round creation and MongoDB overload during local development and testing, the `startGameLoop()` call is **commented out** in the `index.js` file located at: `src/db/index.js`

```
// startGameLoop();
```

If you want to test the game engine locally, simply uncomment the startGameLoop() call in the src/db/index.js file.

---

# 📌 API Endpoints

## 🎲 Bet Routes (`/api/bet`)

- **POST** `/:playerId`  
  Place a bet.

- **POST** `/cashout/:playerId`  
  Cashout from a running round.

## 💼 Wallet Routes (`/api/wallet`)

- **GET** `/:playerId`  
  Get wallet balance.

- **POST** `/:playerId`  
  Create wallet for a player with initial balance.

## 👤 Player Routes (`/api/player`)

- **POST** `/`  
  Register a new player.

## 💡 Provably Fair Algorithm

The crash point is generated using:

```ini
seed = crypto.randomBytes(32)
hash = sha256(seed)
crashPoint = (hash mod 10000) / 100 + 1
```

## 🧮 USD to Crypto Conversion

Using real-time prices from CoinGecko:

```
// Example:
BTC_Price = 60000;
const amountUSD = 10;
const amountBTC = amountUSD / BTC_Price; // 0.00016667 BTC
```

Prices are fetched on-demand during bet placement.

---

## 📬 Deployment

Backend hosted on: [Render Link](https://sixtyninender.com/)

> ⚠️ Note: In production, `startGameLoop()` is intentionally commented out to prevent MongoDB overload.  
> For local testing, uncomment the `startGameLoop()` line in `src/db/index.js`.  
> (See **📌 Important Note** section above for full details.)

## Future Upgrades

- Add real-time updates with WebSocket for bets, rounds, and cashouts.
- Automate game round start using a production-ready game loop.
- Improve wallet balance handling to prevent inconsistencies.
- Create APIs for round history and current round details.
- Enhance error handling and add user authentication.

---

Thank you for using the Crypto Crash Betting Game backend!  
If you have any questions or want to contribute, feel free to open an issue or submit a pull request.

Happy coding! 🚀
