const User = require('./user.model');
const Bill = require('../bills/bill.model');
const Product = require('../bills/product.model');
const bcrypt = require('bcrypt');
const { BCRYPT_PASSES } = require('../auth/auth.util');
const { PASSWORD_REGEX } = require('../auth/auth.util');

/**
 * User entity
 * @typedef {object} User
 * @property {string} email.required
 * @property {string} name.required
 * @property {string} country.required
 * @property {string} currency
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
 * GET /api/users/:id
 * @summary Get user identified by id
 * @security BearerAuth
 * @param {string} request.params.id - User id
 * @return {User} 200 - User entity
 * @return {object} 404 - User not found
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
 * @return {object} 404 - User not found
 */
module.exports.update = async (request, response) => {
  delete request.body.hash;
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
 * @return {object} 404 - User not found
 */
module.exports.remove = async (request, response) => {
  const billsToDelete = await Bill.find({ owner: request.params.id });
  await Product.deleteMany({ bill: { $in: billsToDelete.map((b) => b._id) } });
  await Bill.deleteMany({ owner: request.params.id });
  await User.findByIdAndRemove(request.params.id);
  response.json(request.params.id);
};

/**
 * PATCH /api/users/:id
 * @summary Change the password of the user identified by id
 * @security BearerAuth
 * @param {string} request.params.id - User id
 * @param {object} request.body Old and new password
 * @return {string} 200 - Updated user id
 * @return {object} 400 - Invalid password format
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - User not found
 * @return {object} 405 - Old password incorrect
 */
module.exports.changePassword = async (request, response) => {
  const { oldPassword, newPassword } = request.body;

  if (!newPassword.match(PASSWORD_REGEX)) {
    response.status(400);
    response.send('Invalid password format');
    return;
  }

  const user = await User.findById(request.params.id);
  if (!(await bcrypt.compare(oldPassword, user.hash))) {
    response.status(405);
    response.send('Old password incorrect');
    return;
  }

  const encrypted = await bcrypt.hash(newPassword, BCRYPT_PASSES);
  await User.findByIdAndUpdate(request.params.id, { hash: encrypted });
  response.json(request.params.id);
};
