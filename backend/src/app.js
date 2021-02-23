const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const cors = require('@robertoachar/express-cors');

const logger = require('./logger');
const { catchAll, notFound } = require('./error');

const app = express();

const userRouter = require('./app/api/user/user.router');
const authRouter = require('./app/api/auth/auth.router');
const billRouter = require('./app/api/bill/bill.router');

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
app.use(morgan('combined', { stream: logger.stream }));
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

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/bills', billRouter);

app.use(notFound);
app.use(catchAll);

module.exports = app;
