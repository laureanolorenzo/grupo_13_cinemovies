const carritoController = require('../controllers/carritoController');
const express = require('express');
const router = express.Router();

router.get('/carrito', carritoController.carritoView);

// router.post('/carrito', carritoController.postcarritoData);

module.exports = router;