const currency = [
  {
    "id": "USD",
    "name": "United States Dollar",
    "symbol": "$",
    "rate": 1.0,
    "description": "The primary currency of the United States and many other countries."
  },
  {
    "id": "EUR",
    "name": "Euro",
    "symbol": "€",
    "rate": 0.85,
    "description": "The official currency of many European countries."
  }
];

const getCurrency = (idOrSymbol) => {
  return currency.find(c => c.id === idOrSymbol || c.symbol === idOrSymbol);
};

const addCurrency = (id, name, symbol, rate, description) => {
  currency.push({
    id,
    name,
    symbol,
    rate,
    description
  });
};

console.log(getCurrency("USD"));
console.log(getCurrency("$"));

module.exports = {
  getCurrency,
  addCurrency
};