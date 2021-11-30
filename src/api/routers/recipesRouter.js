const express = require('express');
const rescue = require('express-rescue');
const authentication = require('../middlewares/auth');
const { uploadRecipeImg } = require('../middlewares/upload');
const {
  findAll,
  findById,
  create,
  update,
  addImage,
  remove,
} = require('../controllers/recipesController');

const router = express.Router();

router.get('/', rescue(findAll));

router.get('/:id', rescue(findById));

router.post('/', authentication, rescue(create));

router.put('/:id', authentication, rescue(update));

router.put('/:id/image', authentication, uploadRecipeImg.single('image'), rescue(addImage));

router.delete('/:id', authentication, rescue(remove));

module.exports = router;