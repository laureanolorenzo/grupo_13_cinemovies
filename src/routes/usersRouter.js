const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();

router.get('/usuario', usersController.usersView);


module.exports = router;