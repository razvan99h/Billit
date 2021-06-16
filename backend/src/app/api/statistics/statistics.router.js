const express = require('express');
const catchErrors = require('express-catch-errors');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const {
  checkStatisticsParams,
  getBillsFromInterval,
  buildResponse,
  listStoreStatistics,
  listCategoriesStatistics
} = require('./statistics.controller');

const router = express.Router();
router.use(authenticateToken);

router
  .route('/stores')
  .get(
    catchErrors(checkStatisticsParams),
    catchErrors(getBillsFromInterval),
    catchErrors(listStoreStatistics),
    catchErrors(buildResponse)
  );

router
  .route('/categories')
  .get(
    catchErrors(checkStatisticsParams),
    catchErrors(getBillsFromInterval),
    catchErrors(listCategoriesStatistics),
    catchErrors(buildResponse)
  );

module.exports = router;
