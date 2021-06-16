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
    category: String,
    date: Date,
    type: {
      type: String,
      default: BILL_TYPES.NORMAL
    },
    favorite: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: 'RON'
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
