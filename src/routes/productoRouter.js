const express = require('express');
const router = express.Router();


const productoController = require('../controllers/productoController');

// router.get('/categorias', categoriasController.categoriasView);

// Aclaracion de Guido>> Tenemos muchos controllers y routers! Productos, usuarios y main solo!!
router.get ('/categorias', productoController.allCategoriesView);

router.get('/categorias/:categoria',productoController.singleCategoryView);
//2 routers> categorias/filtered/:categoria
// El otro categorias/all >> Con otro metodo

module.exports = router;