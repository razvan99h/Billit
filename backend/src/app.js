const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const cors = require('@robertoachar/express-cors');

const logger = require('./logger');
const { catchAll, notFound } = require('./error');

const usersRouter = require('./app/api/users/user.router');
const authRouter = require('./app/api/auth/auth.router');
const billsRouter = require('./app/api/bills/bill.router');
const exchangeRatesRouter = require('./app/api/exchange.rates/exchange.rate.router');
const statisticsRouter = require('./app/api/statistics/statistics.router');

const app = express();

const options = {
  info: {
    version: '1.0.0',
    title: 'Billit',
    description: 'Billit Documentation API Endpoints'
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic'
    },
    BearerAuth: {
      type: 'http',
      scheme: 'bearer'
    }
  },
  filesPattern: './**/**/*.js',
  swaggerUIPath: '/api-docs',
  baseDir: __dirname
};
expressJSDocSwagger(app)(options);

app.use(helmet());
app.use(cors());
app.use(morgan('dev', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * GET /ping
 * @summary This is the ping endpoint
 * @return {object} 200 - It works!
 */
app.get('/ping', (_, res) => {
  res.json({ message: 'It works!' });
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/bills', billsRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/exchange-rates', exchangeRatesRouter);

app.use(notFound);
app.use(catchAll);

module.exports = app;
