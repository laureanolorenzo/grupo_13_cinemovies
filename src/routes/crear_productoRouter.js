const express = require ('express');
const router = express.Router();
const crear_productoController = require('../controllers/crear_productoController');

router.get('/crear_producto', crear_productoController.crear_productoView);

router.post('/crear_producto/process', crear_productoController.crear_productoProcess);

module.exports = router;