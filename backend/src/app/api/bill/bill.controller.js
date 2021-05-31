const Bill = require('./bill.model');
const Product = require('./product.model');
const User = require('./../user/user.model');
const { toPlainBillObject } = require('./bill.utils');

/**
 * Bill entity
 * @typedef {object} Bill
 * @property {string} store.required
 * @property {string} number.required
 * @property {Date} date.required
 * @property {array<Product>} products.required
 */

/**
 * Product entity
 * @typedef {object} Product
 * @property {string} name.required
 * @property {number} price.required
 * @property {number} quantity.required
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

module.exports.validateBillFields = async (request, response, next) => {
  const bill = request.body;
  let message;
  if (bill.store !== undefined && typeof bill.store !== 'string') {
    message = 'Bill store should be a string';
  }
  if (bill.number !== undefined && typeof bill.number !== 'string') {
    message = 'Bill number should be a string';
  }
  if (bill.date !== undefined && !Date.parse(bill.date)) {
    message = 'Bill date invalid';
  }
  if (bill.products !== undefined && !(bill.products instanceof Array)) {
    message = 'Bill products should be an array';
  }
  if (bill.products) {
    bill.products.forEach((product) => {
      if (typeof product.name !== 'string') {
        message = 'Product names should be strings';
      }
      if (typeof product.price !== 'number') {
        message = 'Product prices should be numbers';
      }
      if (typeof product.quantity !== 'number') {
        message = 'Product quantities should be numbers';
      }
    });
  }
  if (message) {
    response.status(400);
    response.send(message);
    return;
  }
  next();
};

/**
 * GET /api/bills/owned/
 * @summary Get all bills of a user
 * @security BearerAuth
 * @return {array<Bill>} 200 - the list of Bill entities
 * @return {object} 403 - Resource not owned
 */
module.exports.listOwnedBills = async (request, response) => {
  let bills = await Bill.find({ owner: request.principal })
    .populate('products')
    .sort({ date: -1 });

  bills = bills.map((bill) => toPlainBillObject(bill));

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
module.exports.billDetails = async (request, response) => {
  const bill = await Bill.findById(request.params.id).populate('products');
  response.json(toPlainBillObject(bill));
};

/**
 * POST /api/bills
 * @summary Add a new bill
 * @security BearerAuth
 * @param {Bill} request.body Bill to add
 * @return {Bill} 200 - Newly added Bill entity
 * @return {object} 400 - Invalid entity fields
 */
module.exports.addBill = async (request, response) => {
  const owner = await User.findById(request.principal);
  const { store, number, date, products } = request.body;
  if (!(store && number && date && products)) {
    response.status(400);
    response.send('Missing bill fields');
    return;
  }

  let bill = await Bill.create({ owner, store, number, date });

  const productEntities = await Promise.all(
    products.map((product) => Product.create({ bill, ...product }))
  );

  bill = await Bill.findByIdAndUpdate(
    bill._id,
    { products: productEntities },
    { new: true }
  ).populate('products');
  response.json(bill);
};

/**
 * PUT /api/bills/:id
 * @summary Update bill identified by id
 * @security BearerAuth
 * @param {string} request.params.id - Bill id
 * @param {Bill} request.body Bill to update
 * @return {Bill} 200 - Updated bill entity
 * @return {object} 400 - Invalid entity fields
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - Bill or product does not exist
 */
module.exports.updateBill = async (request, response) => {
  const { products } = request.body;
  let newData = request.body;
  if (products) {
    // eslint-disable-next-line no-restricted-syntax
    for (const product of products) {
      // eslint-disable-next-line no-await-in-loop
      if (product._id && !(await Product.findById(product._id))) {
        response.status(404);
        response.send(`Invalid product id for ${product.name}`);
        return;
      }
    }
    const productEntities = await Promise.all(
      products.map(
        (product) =>
          product._id
            ? Product.findByIdAndUpdate(product._id, product)
            : Product.create({ ...product, bill: request.params.id })
      )
    );
    await Product.deleteMany({
      bill: request.params.id,
      _id: { $nin: productEntities.map((p) => p._id) }
    });
    newData = { ...newData, products: productEntities };
  }

  const bill = await Bill.findByIdAndUpdate(request.params.id, newData, {
    new: true
  })
    .populate('products')
    .exec();
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
module.exports.removeBill = async (request, response) => {
  await Product.deleteMany({ bill: request.params.id });
  await Bill.findByIdAndDelete(request.params.id);
  response.json(request.params.id);
};
