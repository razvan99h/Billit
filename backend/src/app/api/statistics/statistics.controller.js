const moment = require('moment-timezone');
const Bill = require('../bills/bill.model');
const { roundCurrency } = require('../exchange.rates/exchange.rate.util');
const { convertCurrency } = require('../exchange.rates/exchange.rate.util');
const { CURRENCIES } = require('../exchange.rates/fixer');
const { toPlainBillObject } = require('../bills/bill.utils');

/**
 * Entity for statistics response
 * @typedef {object} Statistics
 * @property {Array<string>} labels - the labels to be shown on the chart
 * @property {Array<string>} labelsShort - first 5 labels and 'others'
 * @property {Array<number>} amounts - the amounts corresponding to labels
 * @property {Array<number>} amountsShort - first 5 amounts and 'others'
 * @property {number} total - the total amount
 */

module.exports.checkStatisticsParams = async (request, response, next) => {
  const { currency, timeZone, from, to, date, month } = request.query;
  let message;

  if (!CURRENCIES.includes(currency)) {
    message = `Currency should be one of: ${CURRENCIES}`;
  }

  if (!timeZone) {
    message = 'No timezone provided';
  } else {
    try {
      // eslint-disable-next-line no-new
      new Date(new Date().toLocaleString('en-US', { timeZone }));
    } catch (_) {
      message = 'Invalid timezone';
    }
  }

  if (from && to && !message) {
    if (isNaN(new Date(from)) || isNaN(new Date(to))) {
      message = `Parameters 'from' and 'to' must represent valid dates`;
    } else if (new Date(from) > new Date(to)) {
      message = `Start date 'from' must be before end date 'to'`;
    } else {
      request.startDate = moment.tz(from, timeZone);
      request.endDate = moment.tz(to, timeZone);
      next();
      return;
    }
  }

  if (date && !message) {
    if (isNaN(new Date(date))) {
      message = `Parameter 'date' does not represent a valid date`;
    } else {
      request.startDate = moment.tz(date, timeZone).startOf('day');
      request.endDate = moment.tz(date, timeZone).endOf('day');
      next();
      return;
    }
  }

  if (month && !message) {
    if (isNaN(new Date(month))) {
      message = `Parameter 'month' does not represent a valid date`;
    } else {
      request.startDate = moment.tz(month, timeZone).startOf('month');
      request.endDate = moment.tz(month, timeZone).endOf('month');
      next();
      return;
    }
  }

  if (!message && !(from || to || date || month)) {
    message = 'No valid parameters provided';
  }

  if (message) {
    response.status(400);
    response.send(message);
    return;
  }

  next();
};

module.exports.getBillsFromInterval = async (request, response, next) => {
  const startDate = request.startDate.unix() * 1000;
  const endDate = request.endDate.unix() * 1000;

  request.bills = await Bill.find({
    owner: request.principal,
    date: {
      $gte: startDate,
      $lt: endDate
    }
  }).populate('products');

  next();
};

module.exports.buildResponse = async (request, response) => {
  const sortedCollection = Object.entries(request.collection).sort(
    (a, b) => (a[1] > b[1] ? -1 : 1)
  );

  const labels = [];
  const amounts = [];
  sortedCollection.forEach((e) => {
    labels.push(e[0]);
    amounts.push(roundCurrency(e[1], 0.1));
  });
  const total = roundCurrency(
    amounts.reduce((accumulator, amount) => accumulator + amount, 0),
    1
  );

  let labelsShort;
  let amountsShort;
  const maximumElements = 5;
  if (labels.length > maximumElements) {
    labelsShort = [...labels].splice(0, maximumElements);
    amountsShort = [...amounts].splice(0, maximumElements);
    const othersAmount = roundCurrency(
      [...amounts]
        .splice(maximumElements)
        .reduce((accumulator, amount) => accumulator + amount, 0),
      0.1
    );
    labelsShort.push('others');
    amountsShort.push(othersAmount);
  } else {
    labelsShort = labels;
    amountsShort = amounts;
  }

  response.json({ labels, labelsShort, amounts, amountsShort, total });
};

/**
 * GET /api/statistics/store:currency:timezone:from:to:date:month
 * @summary Get the most frequented stores statistics
 * @security BearerAuth
 * @return {Statistics} 200 - the response containing the list of labels and amounts
 * @return {object} 400 - Invalid query parameters
 * @return {object} 403 - Resource not owned
 */
module.exports.listStoreStatistics = async (request, response, next) => {
  const userCurrency = request.query.currency;
  const bills = request.bills;

  const totals = await Promise.all(
    bills.map((billObj) => {
      const bill = toPlainBillObject(billObj);
      return convertCurrency(bill.currency, userCurrency, bill.total);
    })
  );

  const collection = {};
  for (let i = 0; i < bills.length; i++) {
    collection[bills[i].store] = (collection[bills[i].store] || 0) + totals[i];
  }

  request.collection = collection;
  next();
};

/**
 * GET /api/statistics/categories:currency:timezone:from:to:date:month
 * @summary Get the most purchased categories statistics
 * @security BearerAuth
 * @return {Statistics} 200 - the response containing the list of labels and amounts
 * @return {object} 400 - Invalid query parameters
 * @return {object} 403 - Resource not owned
 */
module.exports.listCategoriesStatistics = async (request, response, next) => {
  const bills = request.bills;
  const userCurrency = request.query.currency;

  const baseConversions = await Promise.all(
    bills.map((bill) => convertCurrency(bill.currency, userCurrency))
  );

  const collection = {};
  for (let i = 0; i < bills.length; i++) {
    const bill = toPlainBillObject(bills[i]);
    if (bill.category) {
      const amount = baseConversions[i] * bill.total;
      collection[bill.category] = (collection[bill.category] || 0) + amount;
    } else {
      bill.products.forEach((product) => {
        const amount = baseConversions[i] * product.price * product.quantity;
        if (product.category) {
          collection[product.category] =
            (collection[product.category] || 0) + amount;
        }
      });
    }
  }

  request.collection = collection;
  next();
};
