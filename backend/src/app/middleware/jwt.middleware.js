const { JWT_SECRET } = require('../../config');
const User = require('../api/user/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports.authenticateToken = (request, response, next) => {
  // Gather the jwt access token from the request header
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    response.sendStatus(401);
    return;
  }
  jwt.verify(token, JWT_SECRET, async (error, id) => {
    if (
      error ||
      !mongoose.Types.ObjectId.isValid(id) ||
      !(await User.findById(id))
    ) {
      response.sendStatus(401);
      return;
    }
    request.principal = id;
    next();
  });
};

module.exports.generateToken = (id) => jwt.sign(id, JWT_SECRET);
