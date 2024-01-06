const { log } = require('console');
let fs = require('fs');
let path = require ('path'); 


const detalle_productoController = {
    detalle_productoView(req,res) {
        if(req.params.id){
            id = req.params.id
        }
        let movies = JSON.parse(fs.readFileSync(path.join(__dirname, '../datos/movies.json'))); 

        let movieToShow = movies.filter(movie => movie.id == id);
        res.render('detalle_producto', {datos: movieToShow});
        
        //console.log(req.params);
        //console.log(movies);
        //res.render('detalle_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = detalle_productoController;