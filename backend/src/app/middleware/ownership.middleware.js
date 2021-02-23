const User = require('../api/user/user.model');
const Bill = require('../api/bill/bill.model');

module.exports.validateUserOwnership = async (request, response, next) => {
  const user = await User.findById(request.principal);

  if (user._id.toString() !== request.params.id.toString()) {
    response.status(403);
    response.send('Resource not owned');
    return;
  }
  next();
};

module.exports.validateBillOwnership = async (request, response, next) => {
  const user = await User.findById(request.principal);
  const bill = await Bill.findById(request.params.id);

  if (user._id.toString() !== bill.owner.toString()) {
    response.status(403);
    response.send('Resource not owned');
    return;
  }
  next();
};
