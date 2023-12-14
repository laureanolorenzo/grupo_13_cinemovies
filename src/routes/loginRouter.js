const loginController = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.get('/login', loginController.loginView);

router.post('/login', loginController.postLoginData);

module.exports = router;