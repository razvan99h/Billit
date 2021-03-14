const express = require('express');
const catchErrors = require('express-catch-errors');
const { validateId } = require('../../middleware/id.middleware');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const {
  validateBillOwnership
} = require('../../middleware/ownership.middleware');
const {
  billExists,
  validateBillFields,
  listOwnedBills,
  billDetails,
  addBill,
  updateBill,
  removeBill
} = require('./bill.controller');

const router = express.Router();
router.use(authenticateToken);

router.route('/').post(catchErrors(validateBillFields), catchErrors(addBill));

router.route('/owned').get(catchErrors(listOwnedBills));

router
  .route('/:id')
  .get(
    catchErrors(validateId),
    catchErrors(billExists),
    catchErrors(validateBillOwnership),
    catchErrors(billDetails)
  )
  .put(
    catchErrors(validateId),
    catchErrors(billExists),
    catchErrors(validateBillOwnership),
    catchErrors(validateBillFields),
    catchErrors(updateBill)
  )
  .delete(
    catchErrors(validateId),
    catchErrors(billExists),
    catchErrors(validateBillOwnership),
    catchErrors(removeBill)
  );

module.exports = router;
