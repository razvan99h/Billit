const fs = require('fs');
const winston = require('winston');

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  defaultMeta: { service: 'backend' },
  transports: [
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: 'error'
    }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

logger.stream = {
  write(message) {
    logger.info(message.trim());
  }
};

module.exports = logger;
