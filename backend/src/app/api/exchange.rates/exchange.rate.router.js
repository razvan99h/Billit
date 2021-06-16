const express = require('express');
const catchErrors = require('express-catch-errors');
const { authenticateToken } = require('../../middleware/jwt.middleware');

const { list, convert, updateAll } = require('./exchange.rate.controller');

const router = express.Router();
router.use(authenticateToken);

router.route('/').get(catchErrors(list));

router.route('/convert').get(convert);

router.route('/update').put(catchErrors(updateAll));

module.exports = router;
