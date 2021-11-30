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
  const { id } = req.params;
  const recipe = await recipesService.update(id, req.body, req.user);
  if (recipe.err) return next(recipe.err);
  return res.status(200).json(recipe);
};

const addImage = async (req, res, next) => {
  if (req.validFileError) return next(req.validFileError);
  const { id } = req.params;
  const image = `localhost:3000/src/uploads/${id}.jpeg`;
  const recipe = await recipesService.update(id, { image }, req.user);
  if (recipe.err) return next(recipe.err);
  return res.status(200).json(recipe);
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await recipesService.remove(id, req.user);
  if (recipe.err) return next(recipe.err);
  return res.status(204).json();
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  addImage,
  remove,
};