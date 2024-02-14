const carritoController = require('../controllers/carritoController');
const express = require('express');
const router = express.Router();

router.get('/carrito', carritoController.carritoView);

router.get('/ir_a_pagar', carritoController.ir_a_pagarView);

// router.post('/carrito', carritoController.postcarritoData);

module.exports = router;