const recipesModel = require('../models/recipesModel');

const create = async (entries) => {
  const recipe = await recipesModel.create(entries);
  return recipe;
};

module.exports = {
  create,
};