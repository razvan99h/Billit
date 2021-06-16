const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema(
  {
    base: {
      type: String,
      unique: true
    },
    rates: Object
  },
  {
    timestamps: true
  }
);

const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema);

module.exports = ExchangeRate;
