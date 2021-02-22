const bcrypt = require('bcrypt');
const { generateToken } = require('../../middleware/jwt.middleware');
const User = require('../user/user.model');

const BCRYPT_PASSES = 10;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;

/**
 * POST /api/auth/login
 * @summary Login user using email and password
 * @param {object} request.body.required Email and un-hashed password
 * @return {object} 200 - Jwt token and _id returned
 * @return {string} 400 - Invalid credentials
 */
module.exports.login = async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    response.status(400);
    response.send('Login failed');
    return;
  }

  if (!password.match(PASSWORD_REGEX)) {
    response.status(400);
    response.send('Invalid password format');
    return;
  }

  const result = await bcrypt.compare(password, user.hash);
  if (result) {
    const token = generateToken(email);
    response.json({ jwt: token, _id: user._id });
  } else {
    response.status(400);
    response.send('Login failed');
  }
};

/**
 * POST /api/auth/logged-in
 * @summary Checks if a user is logged in
 * @security BearerAuth
 * @return {boolean} 200 - true if the users is logged in, false otherwise
 */
module.exports.loggedIn = async (request, response) => {
  const email = request.principal;
  const user = await User.findOne({ email });
  response.send(!!user);
};

/**
 * POST /api/auth/register
 * @summary Register user with email, password and some details
 * @param {object} request.body Email, un-hashed password, name, city and country of a user
 * @return {object} 201 - User entity created, return email and _id
 * @return {string} 400 - Invalid password format
 * @return {object} 409 - Email already in use
 */
module.exports.register = async (request, response) => {
  const { email, password, name, country } = request.body;
  let user = await User.findOne({ email });

  if (user) {
    response.status(409);
    response.send('Email taken');
    return;
  }

  if (!password.match(PASSWORD_REGEX)) {
    response.status(400);
    response.send('Invalid password format');
    return;
  }

  const encrypted = await bcrypt.hash(password, BCRYPT_PASSES);
  user = new User({
    email,
    name,
    country,
    hash: encrypted
  });
  await user.save();

  response.status(201);
  response.json({
    email: user.email,
    _id: user._id
  });
};
