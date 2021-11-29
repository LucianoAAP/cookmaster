const express = require('express');
const rescue = require('express-rescue');
const authentication = require('../middlewares/auth');
const { findAll, create } = require('../controllers/recipesController');

const router = express.Router();

router.get('/', rescue(findAll));

router.post('/', authentication, rescue(create));

module.exports = router;