const mongoose = require('mongoose');
const { BILL_TYPES } = require('./bill.utils');

const BillSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    store: String,
    number: String,
    date: Date,
    type: {
      type: String,
      default: BILL_TYPES.NORMAL
    },
    category: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    currency: {
      type: String,
      default: 'RON'
    }
  },
  {
    timestamps: true
  }
);

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
