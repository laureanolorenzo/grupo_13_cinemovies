const promocionesController = require('../controllers/promocionesController');
const express = require('express');
const router = express.Router();

router.get('/promociones', promocionesController.promocionesView);

// router.post('/registro', promocionesController.postpromocionesData);

module.exports = router;