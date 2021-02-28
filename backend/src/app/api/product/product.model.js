const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill'
    },
    name: String,
    price: Number,
    quantity: Number
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
