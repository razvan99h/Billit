/* eslint no-process-env: 0 */

require('dotenv').config();

const environment = [
  'NODE_ENV',
  'DATABASE',
  'PORT',
  'JWT_SECRET',
  'FIXER_API_KEY'
];

environment.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`${name}: ${process.env[name]}`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: process.env.DATABASE,
  PORT: process.env.PORT,
  FIXER_API_KEY: process.env.FIXER_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET
};
