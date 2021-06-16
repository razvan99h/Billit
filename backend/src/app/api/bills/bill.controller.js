const Bill = require('./bill.model');
const Product = require('./product.model');
const User = require('../users/user.model');
const { CURRENCIES } = require('../exchange.rates/fixer');
const { BILL_TYPES } = require('./bill.utils');
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
  if (bill.store != null && typeof bill.store !== 'string') {
    message = 'Bill store should be a string';
  }
  if (bill.number != null && typeof bill.number !== 'string') {
    message = 'Bill number should be a string';
  }
  if (bill.currency != null && !CURRENCIES.includes(bill.currency)) {
    message = `Bill currency should be one of: ${CURRENCIES}`;
  }
  if (bill.date !== null && !Date.parse(bill.date)) {
    message = 'Bill date invalid';
  }
  if (bill.type !== null && !Object.values(BILL_TYPES).includes(bill.type)) {
    message = 'Bill type invalid';
  }
  if (bill.category != null && typeof bill.category !== 'string') {
    message = 'Bill category should be a string';
  }
  if (bill.category && bill.type === BILL_TYPES.TRUSTED) {
    message = 'Cannot set category on a trusted bill';
  }
  if (
    bill.products !== null &&
    !(bill.products instanceof Array && bill.products.length > 0)
  ) {
    message = 'Bill products should be a non-empty array';
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
      if (bill.category && product.category) {
        message =
          'Cannot set both bill category and individual product categories';
      }
      if (product.category && bill.type !== BILL_TYPES.TRUSTED) {
        message =
          'Cannot set individual product categories on non-trusted bills';
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
  const {
    store,
    number,
    currency,
    date,
    type,
    category,
    products
  } = request.body;
  if (!(store && number && currency && products)) {
    response.status(400);
    response.send('Missing bill fields');
    return;
  }

  let bill = await Bill.create({
    owner,
    store,
    number,
    currency,
    date: date || new Date(),
    type: type || BILL_TYPES.NORMAL,
    category: category || null
  });

  const productEntities = await Promise.all(
    products.map((product) =>
      Product.create({
        bill,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.category ? product.category.toLowerCase() : null
      })
    )
  );

  bill = await Bill.findByIdAndUpdate(
    bill._id,
    { products: productEntities },
    { new: true }
  ).populate('products');

  response.json(toPlainBillObject(bill));
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
 * @return {object} 405 - Cannot update trusted bills
 */
module.exports.updateBill = async (request, response) => {
  const bill = await Bill.findById(request.params.id);
  if (bill.type === BILL_TYPES.TRUSTED) {
    response.status(405);
    response.send('Cannot update trusted bills');
    return;
  }

  const { products } = request.body;
  let newData = request.body;
  delete newData.products;
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
            : Product.create({
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                bill: request.params.id
              })
      )
    );
    await Product.deleteMany({
      bill: request.params.id,
      _id: { $nin: productEntities.map((p) => p._id) }
    });
    newData = { ...newData, products: productEntities };
  }

  const updatedBill = await Bill.findByIdAndUpdate(request.params.id, newData, {
    new: true
  }).populate('products');

  response.json(toPlainBillObject(updatedBill));
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

/**
 * PUT /api/bills/favorite/:id
 * @summary Mark or unmark bill identified by id as favorite
 * @security BearerAuth
 * @param {string} request.params.id - Bill id
 * @param {object} request.body.favorite favorite status to update to
 * @return {Bill} 200 - Updated bill
 * @return {object} 400 - Invalid parameters
 * @return {object} 403 - Resource not owned
 * @return {object} 404 - Bill does not exist
 */
module.exports.markBillFavorite = async (request, response) => {
  const favorite = request.body.favorite;
  if (typeof favorite !== 'boolean') {
    response.status(400);
    response.send(`Field 'favorite' must be a boolean!`);
    return;
  }
  const bill = await Bill.findByIdAndUpdate(
    request.params.id,
    { favorite },
    { new: true }
  );
  response.json(bill);
};
