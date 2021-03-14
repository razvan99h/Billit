const mongoose = require('mongoose');

const app = require('./app');
const config = require('./config');
const logger = require('./logger');

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

if (config.NODE_ENV.includes('local')) {
  logger.info('Local HTTP Server');
  app.listen(config.PORT, () => {
    Object.keys(config).forEach((key) => logger.info(`${key}: ${config[key]}`));
  });
}
