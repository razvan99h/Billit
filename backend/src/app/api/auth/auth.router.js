const express = require('express');
const catchErrors = require('express-catch-errors');
const { authenticateToken } = require('../../middleware/jwt.middleware');
const { login, loggedIn, register } = require('./auth.controller');

const router = express.Router();

router.route('/login').post(catchErrors(login));

router.route('/logged-in').post(authenticateToken, catchErrors(loggedIn));

router.route('/register').post(catchErrors(register));

module.exports = router;
