const express = require('express');
const router = express.Router();
const detalle_productoController = require('../controllers/detalle_productoController');

router.get('/editar_producto/:id', detalle_productoController.editar_productoView);

router.put('/editar_producto/:id', detalle_productoController.editar_producto);

module.exports = router;
