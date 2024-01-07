const { log } = require('console');
let fs = require('fs');
let path = require ('path'); 

// Objeto literal para "mapear" los ratings:
const ratingsMap = {
    '1' : '★☆☆☆☆',
    '2' : '★★☆☆☆',
    '3' : '★★★☆☆',
    '4' : '★★★★☆',
    '5' : '★★★★★',
}


const detalle_productoController = {
    detalle_productoView(req,res) {
        if(req.params.id){
            id = req.params.id
        }
        let movies = JSON.parse(fs.readFileSync(path.join(__dirname, '../datos/movies.json'))); 

        let movieToShow = movies.find(movie => movie.id == id);
        if (!movieToShow) { // Si el usuario "typea" un id a mano que no existe, lo lleva a "error"
            return res.redirect('/error-404');
        } 
        movieToShow['rating'] = ratingsMap[movieToShow['rating']];
        res.render('detalle_producto' , {datos: movieToShow});
        
        //console.log(req.params);
        //console.log(movies);
        //res.render('detalle_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = detalle_productoController;