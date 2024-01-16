const { log } = require('console');
let fs = require('fs');
let path = require ('path'); 

// Variables
let anio = [];
for (i = 1980; i <= 2023; i++) {
    anio.push(i)
}

// Objeto literal para "mapear" los ratings:
const ratingsMap = {
    '1' : '★☆☆☆☆',
    '2' : '★★☆☆☆',
    '3' : '★★★☆☆',
    '4' : '★★★★☆',
    '5' : '★★★★★',
}

//Ruta a JSONmovies
let moviesPath = path.join(__dirname,"../datos/movies.json")
// Conviene hacerlo funcion?
 function listMovies(){
    return JSON.parse(fs.readFileSync(moviesPath, "utf-8")); 
}
function listCategories() {
    const categories = JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
    return categories.map(x => x['title']);
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

        const idPelicula = req.params.id

        movieToShow['rating'] = ratingsMap[movieToShow['rating']];
        res.render('detalle_producto' , {datos: movieToShow, idPelicula: idPelicula});
        
        //console.log(req.params);
        //console.log(movies);
        //res.render('detalle_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    borrar_producto(req,res){

        const moviesPath = path.resolve(__dirname, '../datos/movies.json');
        const movies = fs.readFileSync(moviesPath, 'utf-8');
        let moviesList = JSON.parse(movies);

        let idUrl = req.params.id

        for (let i=0; i<(movies.length-1); i++){
            if (moviesList[i] != undefined && moviesList[i].id == idUrl){

                let nombrePoster = moviesList[i].image;
                let nombreBanner = moviesList[i].banner;

                console.log(nombrePoster);
                console.log(nombreBanner);

                const posterPath = path.resolve(__dirname, `../../public/images/movies/${nombrePoster}`);
                const bannerPath = path.resolve(__dirname, `../../public/images/movies/${nombreBanner}`);

                fs.unlink(posterPath, () => {null}); //para borrar las imagenes de la peli de la carpeta movies
                fs.unlink(bannerPath, () => {null});

                moviesList.splice(i,1);
            };
        }

        moviesList = JSON.stringify(moviesList,null,2);

        fs.writeFile(moviesPath, moviesList, () => {res.redirect("/categorias")}); //sobrescribe el archivo movies.json pero sin las peliculas que borramos
    },
    editar_productoView(req,res){
        let jsonPeliculas = listMovies()
        let idParams = req.params.id;
        const estructuraMovie = {
            categories : listCategories(), // Nuevas categorias deben ir acá!
            year : anio,
            ratings: ['1','2','3','4','5']
        }
        //console.log(jsonPeliculas);
       /*  let idAEditar = jsonPeliculas.find(jsonPeliculas => { 
            return jsonPeliculas.id == req.params.id
        });  */
        let peliAEditar = jsonPeliculas.find(jsonPeliculas => jsonPeliculas.id == idParams);

        //console.log(peliAEditar);
        //console.log(idAEditar);
        //console.log(req.params.id);
         res.render('editar_producto', {peliAEditar:peliAEditar,estructuraMovie:estructuraMovie});
         //res.send(peliAEditar);
    },
    editar_producto(req,res){

       let jsonPeliculas = listMovies();
    

        let idParams = req.params.id; 
        let peliAEditar = jsonPeliculas.find(peli => peli.id == idParams); 

        if(typeof peliAEditar == "undefined" ){
            res.send("No se encontro la pelicula"); // Podriamos hacer un mensaje de error aca
        }else{
            // VER LO QUE LLEGA DE IMAGEN


            let peliEditada = {
                id: peliAEditar.id,
                title: req.body.title,
                year: req.body.year,
                estreno: req.body.estreno,
                description: req.body.description, 
                director: req.body.director, 
                cast: req.body.cast,
                rating: req.body.rating,
                clasificacion_edad: req.body.clasificacion_edad, 
                duration: req.body.duration,
                origin: req.body.origin,
                category: req.body.category,
                
            }
            // Si llegan imagenes, si llega imagen, reemplazarla. Y si llega banner, reemplazarlo.
            if (req.files) {
                const file = req.files;
                peliEditada['image'] = file.image !=undefined?file.image[0].filename : peliAEditar.image;
                if (peliAEditar.banner) { 
                    peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : peliAEditar.banner;
                } else { //Si no habia banner y no llega, poner "defaultBanner.jpg"
                    peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : 'defaultBanner.jpg'; // Crearlo mas tarde
                }
                // res.send(JSON.stringify(file, null, 2));
            } else {
                res.send('Hubo un error al procesar los archivos')
            }

            let posicionPelicula = jsonPeliculas.findIndex(x => x.id == idParams)
            jsonPeliculas[posicionPelicula] = peliEditada;
            fs.writeFileSync(moviesPath, JSON.stringify(jsonPeliculas, null, " "));
            res.redirect('/'); 
        } 
    
    
    }
    
}

module.exports = detalle_productoController;

//console.log(detalle_productoController.editar_producto());