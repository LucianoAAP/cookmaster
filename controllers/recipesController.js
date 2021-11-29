const recipesService = require('../services/recipesService');

const validateEntries = (name, ingredients, preparation) => {
  if (!name || !ingredients || !preparation) {
    return { err: { status: 400, message: 'Invalid entries. Try again.' } };
  }
  return 'OK';
};

const findAll = async (_req, res) => {
  const recipes = await recipesService.findAll();
  return res.status(200).json(recipes);
};

const create = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { _id: userId } = req.user;
  const entriesValidation = validateEntries(name, ingredients, preparation);
  if (entriesValidation.err) return next(entriesValidation.err);
  const recipe = await recipesService.create({ name, ingredients, preparation, userId });
  if (recipe.err) return next(recipe.err);
  return res.status(201).json({ recipe });
};

module.exports = {
  findAll,
  create,
};