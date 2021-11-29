const recipesModel = require('../models/recipesModel');

const findAll = async () => recipesModel.findAll();

const findById = async (id) => {
  const recipe = await recipesModel.findById(id);
  if (!recipe) return { err: { status: 404, message: 'recipe not found' } };
  return recipe;
};

const create = async (entries) => recipesModel.create(entries);

module.exports = {
  findAll,
  findById,
  create,
};