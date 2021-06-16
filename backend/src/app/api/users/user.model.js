const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    country: String,
    hash: String,
    currency: {
      type: String,
      default: 'RON'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
