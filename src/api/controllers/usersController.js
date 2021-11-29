const usersServive = require('../services/usersService');

const validateEntries = (email, password, name) => {
  // Regex tirado de https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password || !name || !emailRegex.test(email)) {
    return { err: { status: 400, message: 'Invalid entries. Try again.' } };
  }
  return 'OK';
};

const create = async (req, res, next) => {
  const { email, password, name } = req.body;
  const role = 'user';
  const entriesValidation = validateEntries(email, password, name);
  if (entriesValidation.err) return next(entriesValidation.err);
  const user = await usersServive.create({ email, password, name, role });
  if (user.err) return next(user.err);
  return res.status(201).json({ user });
};

module.exports = {
  create,
};