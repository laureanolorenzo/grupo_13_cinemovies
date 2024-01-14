const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// router.get('/categorias', categoriasController.categoriasView);

// Aclaracion de Guido>> Tenemos muchos controllers y routers! Productos, usuarios y main solo!!
router.get ('/categorias/:categoria?', categoriasController.categoriasView);

//2 routers> categorias/filtered/:categoria
// El otro categorias/all >> Con otro metodo

module.exports = router;