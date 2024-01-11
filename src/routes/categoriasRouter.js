const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// router.get('/categorias', categoriasController.categoriasView);


router.get ('/categorias/:categoria?', categoriasController.categoriasView);

module.exports = router;