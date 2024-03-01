const express = require('express');
const router = express.Router();
const path = require ('path');
const tmdbController = require('../controllers/tmdbTestController');

router.get('/rellenarDB',tmdbController.rellenarDB);

module.exports = router;