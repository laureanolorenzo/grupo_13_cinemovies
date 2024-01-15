// Creo este controller y su router para ir adelantando el tema de unificar en 3 de cada tipo. La idea es que cada funcionalidad nueva relacionada a productos
// vaya aca, y en un futuro combinamos lo que ya esta hecho

const fs = require('fs');
const path = require('path');

// Rutas
const categoriesRuta = path.join(__dirname, '../datos/categories.json');
const moviesRuta = path.join(__dirname, '../datos/movies.json');

const categoriasController = {
    allCategoriesView(req,res) {
        const categoriesJson = fs.readFileSync(categoriesRuta, {'encoding': 'utf-8'});
        let categories = JSON.parse(categoriesJson);

        const moviesJson = fs.readFileSync(moviesRuta, {'encoding': 'utf-8'});
        let movies = JSON.parse(moviesJson);

        res.render('categorias',{datos: movies,categories:categories})
        // res.send('Hola!');
    },
    singleCategoryView(req,res) {
        const categoriesJson = fs.readFileSync(categoriesRuta, {'encoding': 'utf-8'});
        let categories = JSON.parse(categoriesJson);

        const moviesJson = fs.readFileSync(moviesRuta, {'encoding': 'utf-8'});
        let movies = JSON.parse(moviesJson);
        let categId = req.params.categoria;
        let categoriaParaMostrar = categories.find(x => x.categoria == categId);
        if (categoriaParaMostrar === undefined) {
            res.send('No se encontro la categoria'); // Manejarlo distinto en el futuro?? Seria sit. en la que el usuario pone la categ. a mano
        }
        let filteredMovies = movies.filter(movie => (movie.category == categoriaParaMostrar.title));
        res.render('categorias', {datos: filteredMovies,todas:false,categories:categories});
    },


    categoriasView(req,res) {
        // Categorias


        if (!(req.params.categoria)) {
             res.render('categorias', {datos: movies,todas:true,categories:categories}); //Luego cambiar!!!
        } else {

            

        }
        

        //Peliculas
        //res.send(movies);
        // res.render('categorias',{datos:movies}); // Luego incluir datos de cada categoria en particular!!
    },

    drama: (req,res)=>{
        res.render ('categoria_drama');
    }
}

module.exports = categoriasController;