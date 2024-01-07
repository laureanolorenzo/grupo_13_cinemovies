const fs = require ('fs');
const path = require ('path');
let anio = [];
for (i = 1980; i <= 2023; i++) {
    anio.push(i)
}

const productoController = {
    detalle_productoView(req,res) {
        res.render('detalle_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
        
         /* if(req.params.id){
            id = req.params.id
        }
        let movies = JSON.parse(fs.readFileSync(path.join(__dirname, '../datos/movies.json'))); 
    
        let movieToShow = movies.filter(movie => movie.id == id);
        res.render('detalle_producto',{datos: movieToShow}); */
        
        //console.log(req.params);
        //console.log(movies);
    },

    detalle_productoid(req,res){
        if(req.params.id){
            id = req.params.id
        }
        let movies = JSON.parse(fs.readFileSync(path.join(__dirname, '../datos/movies.json'))); 
    
        let movieToShow = movies.filter(movie => movie.id == id);
        res.render('detalle_producto');
        
        //console.log(req.params);
        //console.log(movies);
    },

    crear_productoView(req,res) {
        const estructuraMovie = {
            categories : ['Acción','Terror','Drama','Comedia','Romance'], // Nuevas categorias deben ir acá!
            year : anio
        }
        res.render('crear_producto',{estructuraMovie}); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    crear_productoProcess(req,res, next) {
        if (req.body) {
            const moviesPath = path.resolve(__dirname, '../datos/movies.json');
            const movies = fs.readFileSync(moviesPath, 'utf-8');
            let lastId;
            let moviesObj;
            if (movies.length === 0) {
                moviesObj = [];
                lastId = 0;
            } else {
                moviesObj = JSON.parse(movies);
                lastId = moviesObj[moviesObj.length - 1].id;

            }
            let newMovie = req.body;
            newMovie['id'] = lastId + 1;
            moviesObj.push(newMovie);
            fs.writeFileSync(moviesPath,JSON.stringify(moviesObj,null,2));
            res.redirect('/');
            console.log(moviesObj);
        } else {
            next(new Error('Se ha producido un error. Por favor vuelva a intentarlo.'))
        }
    },

    editar_productView(req,res){
        res.render('editar_producto')
    },
}

module.exports = productoController;