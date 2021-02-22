const express = require('express');
const catchErrors = require('express-catch-errors');
const { login, loggedIn, register } = require('./auth.controller');

const router = express.Router();

router.route('/login').post(catchErrors(login));

router.route('/logged-in').post(catchErrors(loggedIn));

router.route('/register').post(catchErrors(register));

module.exports = router;
