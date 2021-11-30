const usersModel = require('../models/usersModel');

const create = async (entries) => {
  const user = await usersModel.create(entries);
  if (!user) return { err: { status: 409, message: 'Email already registered' } };
  return user;
};

const createAdmin = async (entries, loggedInUser) => {
  if (loggedInUser.role !== 'admin') {
    return { err: { status: 403, message: 'Only admins can register new admins' } };
  }
  const user = await usersModel.create(entries);
  if (!user) return { err: { status: 409, message: 'Email already registered' } };
  return user;
};

module.exports = {
  create,
  createAdmin,
};