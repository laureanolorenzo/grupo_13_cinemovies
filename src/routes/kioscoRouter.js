const express = require('express');
const router = express.Router();
const kioscoController = require('../controllers/kioscoController');

router.get('/kiosco', kioscoController.kioscoView);

module.exports = router;