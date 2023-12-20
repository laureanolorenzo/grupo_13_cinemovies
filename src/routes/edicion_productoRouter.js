const express = require ('express');
const router = express.Router();
const edicion_productoController = require('../controllers/edicion_productoController');

router.get('/edicion_producto', edicion_productoController.edicion_productoView);

module.exports = router;