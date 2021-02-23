const mongoose = require('mongoose');

// TODO: add fields like age, sex, city in order to get better data about users
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
