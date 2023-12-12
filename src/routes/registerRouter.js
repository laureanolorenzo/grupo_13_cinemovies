const registerController = require('../controllers/registerController');
const express = require('express');
const router = express.Router();

router.get('/registro', registerController.registerView);

router.post('/registro', registerController.postRegisterData);

module.exports = router;