const express = require('express');
const router = express.Router();
const detalle_productoController = require('../controllers/detalle_productoController');

/* router.get('/detalle_producto', detalle_productoController.detalle_productoView); */
router.get('/detalle_producto/:id', detalle_productoController.detalle_productoView);

router.delete('/detalle_producto/:id', detalle_productoController.borrar_producto);



module.exports = router;