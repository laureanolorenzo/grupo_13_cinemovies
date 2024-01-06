const fs = require ('fs');
const path = require ('path');
let anio = [];
for (i = 1980; i <= 2023; i++) {
    anio.push(i)
}

const crear_productoController = {
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
}

module.exports = crear_productoController;
