const User = require('../api/user/user.model');

module.exports.validateUserOwnership = async (request, response, next) => {
  const principal = await User.findOne({ email: request.principal });

  if (principal._id !== request.params.id) {
    response.status(403);
    response.send('Resource not owned');
    return;
  }
  next();
};
