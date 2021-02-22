const User = require('./user.model');

/**
 * User entity
 * @typedef {object} User
 * @property {string} email.required
 * @property {string} name.required
 * @property {string} country.required
 */

module.exports.userExists = async (request, response, next) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    response.status(404);
    response.send('User not found');
    return;
  }
  next();
};

/**
 * GET /api/users
 * @summary Get all users
 * @security BearerAuth
 * @return {array<User>} 200 - the list of User entities
 */
module.exports.list = async (request, response) => {
  const users = await User.find();
  response.json(users);
};

/**
 * GET /api/users/:id
 * @summary Get user identified by id
 * @security BearerAuth
 * @param {string} request.params.id - User id
 * @return {User} 200 - User entity
 * @return {object} 404 - User does not exist
 */
module.exports.view = async (request, response) => {
  const user = await User.findById(request.params.id);
  response.json(user);
};

/**
 * PUT /api/users/:id
 * @summary Update user identified by id
 * @security BearerAuth
 * @param {string} request.params.id - User id
 * @param {User} request.body User to update
 * @return {User} 200 - Updated user entity
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - User does not exist
 */
module.exports.update = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true
  }).exec();
  response.json(user);
};

/**
 * DELETE /api/users/:id
 * @summary Delete user identified by id
 * @security BearerAuth
 * @param {string} request.params.id - User id
 * @return {string} 200 - Deleted user id
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - User does not exist
 */
module.exports.remove = async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.json(request.params.id);
};
