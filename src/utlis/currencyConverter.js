const fetchCurrentCryptoPrice = async (currency) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`;

    const response = await fetch(url);
    const data = await response.json();
    const bitcoinUSD = data.bitcoin.usd;
    const ethereumUSD = data.ethereum.usd;

    if (currency === "BTC") {
      return bitcoinUSD;
    } else {
      return ethereumUSD;
    }
  } catch (error) {
    console.log("Error in fetching crypto prices", error.message);
    throw new Error("Cannot fetch crypto prices and no cache available");
  }
};

const convertUSDToCrypto = async ({ usdAmount, currency }) => {
  const pricePerUnit = await fetchCurrentCryptoPrice(currency);
  const cryptoAmount = usdAmount / pricePerUnit;

  return {
    cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
    priceAtBetTime: pricePerUnit,
  };
};

module.exports = { convertUSDToCrypto };
