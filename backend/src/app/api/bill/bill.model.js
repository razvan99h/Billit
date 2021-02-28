const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    store: String,
    number: String,
    date: Date,
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
