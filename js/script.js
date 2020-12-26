const BTCBuyPrice = 96161.24;
const ETHBuyPrice = 3313.96;
const BTCInitial = 5000;
const ETHInitial = 2500;
const priceState = {
  BTCBRL: BTCBuyPrice,
  ETHBRL: ETHBuyPrice,
};

window.onload = async () => {
  updatePriceDisplay('BTCBRL');
  updatePriceDisplay('ETHBRL');
  setInterval(async () => {
    updatePriceDisplay('BTCBRL');
    updatePriceDisplay('ETHBRL');
    updateResult('BTC');
    updateResult('ETH');
  }, 1000);
};

const getTickerPrice = async (symbol) => {
  let resp = await (
    await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
  ).json();
  console.log(symbol, priceState[symbol]);
  return resp.price;
};

const updatePriceDisplay = async (symbol) => {
  const PriceDisplay = document.querySelector(`#${symbol}`);
  let currentPrice = await getTickerPrice(symbol);
  PriceDisplay.innerText = formatter.format(currentPrice);
  if (currentPrice > priceState[symbol]) {
    PriceDisplay.classList.add('light-green', 'accent-4');
    setTimeout(() => {
      PriceDisplay.classList.remove('light-green', 'accent-4');
    }, 500);
  } else if (currentPrice < priceState[symbol]) {
    PriceDisplay.classList.add('red', 'accent-4');
    setTimeout(() => {
      PriceDisplay.classList.remove('red', 'accent-4');
    }, 500);
  }
  priceState[symbol] = currentPrice;
};

const formatter = new Intl.NumberFormat([], {
  style: 'currency',
  currency: 'BRL',
});

function formatBRL(element) {
  let formattedValue = formatter.format(element.value);
  element.value = formattedValue;

  console.log(formatter.format(element.value));
}

const reverseFormat = (formattedValue) => {
  formattedValue = formattedValue.replace('R$', '');
  formattedValue = formattedValue.replace(' ', '');
  formattedValue = formattedValue.replace('&nbsp', '');
  formattedValue = formattedValue.replace('.', '');
  formattedValue = formattedValue.replace(',', '.');
  return parseInt(formattedValue);
};

const updateResult = (coin) => {
  const investedValue = reverseFormat(
    document.getElementById(`${coin}_invested`).value
  );
  console.log(investedValue);
  const buyPrice = reverseFormat(
    document.getElementById(`${coin}_buyprice`).value
  );
  console.log(buyPrice);

  let resultPercentage = (priceState[`${coin}BRL`] / buyPrice - 1) * 100;
  console.log(resultPercentage);
  let resultValue = (priceState[`${coin}BRL`] / buyPrice) * investedValue;
  console.log(resultValue);

  const resultPercentageDisplay = document.getElementById(
    `${coin}_resultpercentage`
  );
  const resultValueDisplay = document.getElementById(`${coin}_resultvalue`);

  resultPercentageDisplay.innerText = percentageFormatter(resultPercentage);
  resultValueDisplay.innerText = formatter.format(resultValue);

  const resultBox = document.getElementById(`${coin}_resultbox`);
  if (resultPercentage >= 0) {
    resultBox.classList.remove('red', 'accent-3');
    resultBox.classList.add('green', 'accent-3');
  } else {
    resultBox.classList.remove('green', 'accent-3');
    resultBox.classList.add('red', 'accent-3');
  }
};

const percentageFormatter = (value) => {
  if (value >= 0) {
    return `(+${value.toFixed(2)} %)`;
  } else {
    return `(${value.toFixed(2)} %)`;
  }
};
