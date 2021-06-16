const ExchangeRate = require('./exchange.rate.model');
const { CURRENCIES } = require('./fixer');
const { convertCurrency } = require('./exchange.rate.util');
const { updateExchangeRates } = require('./exchange.rate.util');

/**
 * An exchange rate
 * @typedef {object} ExchangeRate
 * @property {string} base.required - The exchange rate base currency
 * @property {Object} rates.required - The exchange rates for from the base currency
 */

/**
 * GET /api/exchange-rates
 * @summary Get all exchange rates
 * @security BearerAuth
 * @return {array<ExchangeRate>} 200 - the list of UserEvent entities
 * @return {string} 403 - Unauthorized
 */
module.exports.list = async (_, res) => {
  const exchangeRates = await ExchangeRate.find();
  res.json(exchangeRates);
};

/**
 * GET /api/exchange-rates/convert
 * @queryParam {string} from.required - Base currency
 * @queryParam {string} to.required - Exchange currency
 * @queryParam {string} amount.required - The amount to be converted
 * @summary Converts an amount from a currency to another
 * @security BearerAuth
 * @return {object} 200 - the converted amount
 * @return {string} 400 - Invalid request parameters
 * @return {string} 405 - Conversion not supported
 */
module.exports.convert = async (req, res) => {
  const { from, to, amount } = req.query;
  if (!(from && to && amount)) {
    res.status(400);
    res.send('Invalid request parameters');
    return;
  }
  if (from === to) {
    res.json({ result: parseFloat(amount) });
    return;
  }
  if (!(CURRENCIES.includes(from) && CURRENCIES.includes(to))) {
    res.status(405);
    res.send('Conversion not supported');
    return;
  }
  res.json({ result: await convertCurrency(from, to, amount) });
};

/**
 * PUT /api/exchange-rates/update
 * @summary Update all exchange rates
 * @security BearerAuth
 * @return {array<ExchangeRate>} 200 - the list of ExchangeRate entities
 * @return {string} 403 - Unauthorized
 * @return {object} 405 - Could not access fixer.io endpoints
 */
module.exports.updateAll = async (_, res) => {
  const errorMessage = await updateExchangeRates();
  if (errorMessage) {
    res.status(405);
    res.send(errorMessage);
    return;
  }
  res.sendStatus(200);
};
