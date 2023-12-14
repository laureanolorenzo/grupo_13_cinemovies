const express = require('express');
const router = express.Router();
const detalle_productoController = require('../controllers/detalle_productoController');

router.get('/detalle_producto', detalle_productoController.detalle_productoView);

module.exports = router;