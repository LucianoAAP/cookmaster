const express = require('express');
const rescue = require('express-rescue');
const authentication = require('../middlewares/auth');
const { findAll, findById, create, update } = require('../controllers/recipesController');

const router = express.Router();

router.get('/', rescue(findAll));

router.get('/:id', rescue(findById));

router.post('/', authentication, rescue(create));

router.put('/:id', authentication, rescue(update));

module.exports = router;