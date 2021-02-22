const { JWT_SECRET } = require('../../config');
const jwt = require('jsonwebtoken');

module.exports.authenticateToken = (request, response, next) => {
  // Gather the jwt access token from the request header
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    response.sendStatus(401);
    return;
  }

  jwt.verify(token, JWT_SECRET, (error, email) => {
    if (error) {
      response.sendStatus(403);
      return;
    }
    request.principal = email;
    next();
  });
};

module.exports.generateToken = (email) => jwt.sign(email, JWT_SECRET);
