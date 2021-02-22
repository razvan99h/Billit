const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    country: String,
    hash: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
