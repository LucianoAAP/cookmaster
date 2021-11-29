const recipesModel = require('../models/recipesModel');

const findAll = async () => recipesModel.findAll();

const findById = async (id) => {
  const recipe = await recipesModel.findById(id);
  if (!recipe) return { err: { status: 404, message: 'recipe not found' } };
  return recipe;
};

const create = async (entries) => recipesModel.create(entries);

const update = async (id, entries, user) => {
  const recipe = await findById(id);
  if (!recipe) return recipe;
  const { _id, role } = user;
  if (role !== 'admin' && _id !== recipe.userId) {
    return { err: { status: 401, message: 'unauthorized action' } };
  }
  return recipesModel.update(id, entries, _id);
};

const remove = async (id, user) => {
  const recipe = await findById(id);
  if (recipe.err) return recipe;
  const { _id, role } = user;
  if (role !== 'admin' && _id !== recipe.userId) {
    return { err: { status: 401, message: 'unauthorized action' } };
  }
  return recipesModel.remove(id);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};