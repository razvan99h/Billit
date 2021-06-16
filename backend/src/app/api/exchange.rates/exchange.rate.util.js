const { getFixerIoExchangeRates } = require('./fixer');
const ExchangeRate = require('./exchange.rate.model');
const logger = require('../../../logger');
const { CURRENCIES } = require('./fixer');

const updateExchangeRates = async () => {
  const baseCurrency = 'EUR';
  const fixerIoResponse = await getFixerIoExchangeRates(baseCurrency);
  if (fixerIoResponse == null) {
    const message = `Error on accessing fixer.io endpoints for currency: ${baseCurrency}`;
    logger.error(message);
    return message;
  }
  const rates = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const exchangeCurrency of CURRENCIES) {
    if (Object.keys(fixerIoResponse.rates).includes(exchangeCurrency)) {
      rates[exchangeCurrency] = fixerIoResponse.rates[exchangeCurrency];

      const exchangeCurrencyRates = {};
      CURRENCIES.forEach((currency) => {
        exchangeCurrencyRates[currency] =
          fixerIoResponse.rates[currency] /
          fixerIoResponse.rates[exchangeCurrency];
      });
      // eslint-disable-next-line no-await-in-loop
      await ExchangeRate.findOneAndUpdate(
        { base: exchangeCurrency },
        {
          base: exchangeCurrency,
          rates: exchangeCurrencyRates
        },
        { upsert: true }
      );
    }
  }
  await ExchangeRate.findOneAndUpdate(
    { base: baseCurrency },
    {
      base: baseCurrency,
      rates
    },
    { upsert: true }
  );

  return null;
  /* eslint-enable */
};

module.exports.updateExchangeRates = updateExchangeRates;

module.exports.convertCurrency = async (from, to, amount = 1) => {
  if (from === to) {
    return amount;
  }
  const exchangeRate = await ExchangeRate.findOne({ base: from });
  return exchangeRate.rates[to] * amount;
};

module.exports.roundCurrency = (
  value,
  step = 0,
  offValue = 0,
  fractionDigits = 2
) => {
  // Rounds a number to the biggest multiple of 'step' and subtracts 'offValue'
  //  if the rounded value is bigger than the original value.
  //  It displays 'fractionDigits' fraction digits
  // ex: value 2.74, step = 0.1, offValue = 0.01 -> 2.79
  // ex: value 2.70, step = 0.1, offValue = 0.01 -> 2.70

  if (step === 0) {
    return parseFloat(value.toFixed(fractionDigits));
  }
  const inv = 1.0 / step;
  const result = Math.ceil(value * inv) / inv - offValue;
  return parseFloat(Math.max(result, value).toFixed(fractionDigits));
};

module.exports.exchangeRateScheduler = async () => {
  logger.info('Updating Exchange rates...');
  await updateExchangeRates();
};
