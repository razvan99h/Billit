const express = require('express');
const catchErrors = require('express-catch-errors');
const { validateId } = require('../../middleware/id.middleware');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const {
  validateUserOwnership
} = require('../../middleware/ownership.middleware');

const {
  userExists,
  view,
  update,
  remove,
  changePassword
} = require('./user.controller');

const router = express.Router();
router.use(authenticateToken);

router
  .route('/:id')
  .get(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(view)
  )
  .put(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(update)
  )
  .patch(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(changePassword)
  )
  .delete(
    catchErrors(validateId),
    catchErrors(userExists),
    catchErrors(validateUserOwnership),
    catchErrors(remove)
  );

module.exports = router;
