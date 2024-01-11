const fs = require('fs');
const path = require('path');

// Rutas
const categoriesRuta = path.join(__dirname, '../datos/categories.json');
const moviesRuta = path.join(__dirname, '../datos/movies.json');

const categoriasController = {
    categoriasView(req,res) {
        // Categorias
        const categoriesJson = fs.readFileSync(categoriesRuta, {'encoding': 'utf-8'});
        let categories = JSON.parse(categoriesJson);

        const moviesJson = fs.readFileSync(moviesRuta, {'encoding': 'utf-8'});
        let movies = JSON.parse(moviesJson);

        if (!(req.params.categoria)) {
             res.render('categorias', {datos: movies}); //Luego cambiar!!!
        } else {
            let categId = req.params.categoria;
            let categoriaParaMostrar = categories.find(x => x.categoria == categId);
            if (categoriaParaMostrar === undefined) {
                res.send('No se encontro la categoria');
            }
            movies = movies.filter(movie => movie.category == categoriaParaMostrar.title);
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