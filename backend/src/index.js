const mongoose = require('mongoose');
const cron = require('node-cron');

const app = require('./app');
const config = require('./config');
const logger = require('./logger');
const {
  exchangeRateScheduler
} = require('./app/api/exchange.rates/exchange.rate.util');

mongoose.connect(config.DATABASE);
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
  logger.error(err.message);
  process.exit(1);
});

cron.schedule('0 0 * * *', exchangeRateScheduler);

if (config.NODE_ENV.includes('local')) {
  logger.info('Local HTTP Server');
  app.listen(config.PORT, () => {
    Object.keys(config).forEach((key) => logger.info(`${key}: ${config[key]}`));
  });
}
