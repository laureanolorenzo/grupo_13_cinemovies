const { log } = require('console');
const fs = require ('fs');
const path = require ('path');
let anio = [];
for (i = 1980; i <= 2023; i++) {
    anio.push(i)
}

const crear_productoController = {
    crear_productoView(req,res) {
        const admin = true;
        const estructuraMovie = {
            categories : ['Acción','Terror','Drama','Comedia','Romance'], // Nuevas categorias deben ir acá!
            year : anio,
            ratings: ['1','2','3','4','5']
        }
        if (!admin) {
            res.send('No tiene permiso para realizar esta acción');
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
            const file = req.files;
            // if (!file) {
            //     res.send('Por favor suba una imagen para su película'); // Buscar una mejor forma de validarlo!
            //    return next(new Error('Por favor suba una imagen para su película'));
            // }
            newMovie['id'] = lastId + 1;
            moviesObj.push(newMovie);
            // newMovie['image'] = file['filename'];            
            if (file.image !=undefined && file.banner !=undefined) {
                newMovie['image'] = file.image[0].filename;
                newMovie['banner'] = file.banner[0].filename;
            } else {
                res.send('Debe agregar un póster y un banner para la película');
            };
            newMovie['duration'] =  newMovie['duration'] + " minutos";
            fs.writeFileSync(moviesPath,JSON.stringify(moviesObj,null,2));
            res.redirect('/');
            // console.log(moviesObj);

            console.log(req.body);
            console.log(req.file);
        } else {
            next(new Error('Se ha producido un error. Por favor vuelva a intentarlo.'));
        }
    },
}

module.exports = crear_productoController;
