const rescue = require('express-rescue');
const jwt = require('jsonwebtoken');
const loginService = require('../services/loginService');

const secret = 'xablau';

const validateEntries = (email, password) => {
  if (!email || !password) {
    return { err: { status: 401, message: 'All fields must be filled' } };
  }
  return 'OK';
};

module.exports = rescue(async (req, res, next) => {
  const { email, password } = req.body;
  const entriesValidation = validateEntries(email, password);
  if (entriesValidation.err) return next(entriesValidation.err);
  const jwtConfig = { expiresIn: '1h' };
  const user = await loginService(email, password);
  if (user.err) return next(user.err);
  const { _id, role } = user;
  const payload = { _id, email, role };
  const token = jwt.sign(payload, secret, jwtConfig);
  return res.status(200).json({ token });
});