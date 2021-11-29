const recipesService = require('../services/recipesService');

const validateEntries = ({ name, ingredients, preparation }) => {
  if (!name || !ingredients || !preparation) {
    return { err: { status: 400, message: 'Invalid entries. Try again.' } };
  }
  return 'OK';
};

const findAll = async (_req, res) => {
  const recipes = await recipesService.findAll();
  return res.status(200).json(recipes);
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await recipesService.findById(id);
  if (recipe.err) return next(recipe.err);
  return res.status(200).json(recipe);
};

const create = async (req, res, next) => {
  const { _id: userId } = req.user;
  const entriesValidation = validateEntries(req.body);
  if (entriesValidation.err) return next(entriesValidation.err);
  const recipe = await recipesService.create({ ...req.body, userId });
  if (recipe.err) return next(recipe.err);
  return res.status(201).json({ recipe });
};

const update = async (req, res, next) => {
  if (req.user.err) return next(req.user.err);
  const { id } = req.params;
  const entriesValidation = validateEntries(req.body);
  if (entriesValidation.err) return next(entriesValidation.err);
  const recipe = await recipesService.update(id, req.body, req.user);
  if (recipe.err) return next(recipe.err);
  return res.status(200).json(recipe);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
};