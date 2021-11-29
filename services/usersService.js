const usersModel = require('../models/usersModel');

const create = async (entries) => {
  const user = await usersModel.create(entries);
  if (!user) return { err: { status: 409, message: 'Email already registered' } };
  return user;
};

module.exports = {
  create,
};