const express = require('express');
const rescue = require('express-rescue');
const authentication = require('../middlewares/auth');
const { create, createAdmin } = require('../controllers/usersController');

const router = express.Router();

router.post('/', rescue(create));
router.post('/admin', authentication, rescue(createAdmin));

module.exports = router;