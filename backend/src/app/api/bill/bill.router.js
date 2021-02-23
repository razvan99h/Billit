const express = require('express');
const catchErrors = require('express-catch-errors');
const { validateId } = require('../../middleware/id.middleware');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const {
  validateUserExistence
} = require('../../middleware/existence.middleware');

const {
  validateBillOwnership
} = require('../../middleware/ownership.middleware');

const {
  billExists,
  listOwned,
  view,
  add,
  update,
  remove
} = require('./bill.controller');

const router = express.Router();
router.use(authenticateToken);

router.route('/').post(catchErrors(validateUserExistence), catchErrors(add));

router
  .route('/owned')
  .get(catchErrors(validateUserExistence), catchErrors(listOwned));

router
  .route('/:id')
  .get(catchErrors(validateId), catchErrors(billExists), catchErrors(view))
  .put(
    catchErrors(validateId),
    catchErrors(billExists),
    catchErrors(validateBillOwnership),
    catchErrors(update)
  )
  .delete(
    catchErrors(validateId),
    catchErrors(billExists),
    catchErrors(validateBillOwnership),
    catchErrors(remove)
  );

module.exports = router;
