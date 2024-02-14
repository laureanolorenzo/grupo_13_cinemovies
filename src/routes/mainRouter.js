const mainController = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

router.get('/', mainController.index);
router.get('/home', mainController.index);
router.get('/promociones', mainController.promocionesView);

module.exports = router;
