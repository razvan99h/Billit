const User = require('../api/user/user.model');

module.exports.validateUserExistence = async (request, response, next) => {
  const user = await User.findById(request.principal);
  if (!user) {
    response.status(401);
    response.send('Unauthorized');
    return;
  }
  next();
};
