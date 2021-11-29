const express = require('express');
const rescue = require('express-rescue');
const authentication = require('../middlewares/auth');
const { create } = require('../controllers/recipesController');

const router = express.Router();

router.post('/', authentication, rescue(create));

module.exports = router;