/* eslint no-unused-vars: 0 */

const logger = require('./logger');

module.exports.notFound = (req, res, next) => {
  logger.warn('Not found');
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
};

module.exports.catchAll = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something broke';
  logger.error(message);
  res.status(status).json({ error: { message } });
};
