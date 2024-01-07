const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/editar_producto', productoController.editar_productView);

module.exports = router;
