const loginModel = require('../models/loginModel');

module.exports = async (email, password) => {
  const user = await loginModel(email);
  if (!user || user.password !== password) {
    return { err: { status: 401, message: 'Incorrect username or password' } };
  }
  return user;
};