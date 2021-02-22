const express = require('express');
const catchErrors = require('express-catch-errors');
const { validateId } = require('../../middleware/id.middleware');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const {
  validateUserOwnership
} = require('../../middleware/ownership.middleware');

const { userExists, remove, list, update, view } = require('./user.controller');

const router = express.Router();
router.use(authenticateToken);

router.route('/').get(list);

router
  .route('/:id')
  .get(catchErrors(validateId), catchErrors(userExists), catchErrors(view))
  .put(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(update)
  )
  .delete(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(remove)
  );

module.exports = router;
