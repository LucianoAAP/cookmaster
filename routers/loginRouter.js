const express = require('express');
const rescue = require('express-rescue');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/', rescue(loginController));

module.exports = router;