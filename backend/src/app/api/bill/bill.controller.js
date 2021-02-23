const Bill = require('./bill.model');
const User = require('./../user/user.model');

/**
 * Bill entity
 * @typedef {object} Bill
 * @property {string} store.required
 * @property {string} number.required
 * @property {Date} date.required
 */

module.exports.billExists = async (request, response, next) => {
  const bill = await Bill.findById(request.params.id);
  if (!bill) {
    response.status(404);
    response.send('Bill not found');
    return;
  }
  next();
};

/**
 * GET /api/bills/owned/
 * @summary Get all bills of a user
 * @security BearerAuth
 * @return {array<Bill>} 200 - the list of Bill entities
 * @return {object} 403 - Unauthorized
 * @return {object} 403 - Resource not owned
 */
module.exports.listOwned = async (request, response) => {
  const bills = await Bill.find({ owner: request.principal });
  response.json(bills);
};

/**
 * GET /api/bills/:id
 * @summary Get bill identified by id
 * @security BearerAuth
 * @param {string} request.params.id - Bill id
 * @return {User} 200 - Bill entity
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - Bill does not exist
 */
module.exports.view = async (request, response) => {
  const bill = await Bill.findById(request.params.id);
  response.json(bill);
};

/**
 * POST /api/bills
 * @summary Add a new bill
 * @security BearerAuth
 * @param {Bill} request.body Bill to add
 * @return {Bill} 200 - Newly added Bill entity
 * @return {object} 401 - Unauthorized
 */
module.exports.add = async (request, response) => {
  const owner = await User.findById(request.principal);
  const { store, number, date } = request.body;
  const bill = await Bill.create({ owner, store, number, date });
  response.json(bill);
};

/**
 * PUT /api/bills/:id
 * @summary Update bill identified by id
 * @security BearerAuth
 * @param {string} request.params.id - Bill id
 * @param {Bill} request.body Bill to update
 * @return {Bill} 200 - Updated bill entity
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - Bill does not exist
 */
module.exports.update = async (request, response) => {
  const bill = await Bill.findByIdAndUpdate(request.params.id, request.body, {
    new: true
  }).exec();
  response.json(bill);
};

/**
 * DELETE /api/bills/:id
 * @summary Delete bill identified by id
 * @security BearerAuth
 * @param {string} request.params.id - Bill id
 * @return {string} 200 - Deleted bill id
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - Bill does not exist
 */
module.exports.remove = async (request, response) => {
  await Bill.findByIdAndRemove(request.params.id);
  response.json(request.params.id);
};
