const recipesModel = require('../models/recipesModel');

const findAll = async () => recipesModel.findAll();

const create = async (entries) => {
  const recipe = await recipesModel.create(entries);
  return recipe;
};

module.exports = {
  findAll,
  create,
};