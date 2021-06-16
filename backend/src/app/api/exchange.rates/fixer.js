const axios = require('axios');
const logger = require('../../../logger');
const { FIXER_API_KEY } = require('../../../config');

const FIXER_IO_URL = 'http://data.fixer.io/api';

module.exports.getFixerIoExchangeRates = async (baseCurrency) => {
  try {
    const response = await axios.get(
      `${FIXER_IO_URL}/latest?access_key=${FIXER_API_KEY}&base=${baseCurrency}`
    );
    if (!response.data.success) {
      logger.error(
        `Error response while getting exchange rates from fixer.io for currency ${baseCurrency}:`,
        response.data
      );
      return null;
    }
    return response.data.success ? response.data : null;
  } catch (error) {
    logger.error(
      `Error while getting exchange rates from fixer.io for currency ${baseCurrency}:`,
      error
    );
    return null;
  }
};

module.exports.CURRENCIES = ['RON', 'EUR', 'USD', 'HUF'];
