const mongoose = require('mongoose');

module.exports.validateId = async (request, response, next) => {
  // Checks if a given id from url params is a mongoose-valid one
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(404);
    response.send('Invalid id');
    return;
  }
  next();
};
