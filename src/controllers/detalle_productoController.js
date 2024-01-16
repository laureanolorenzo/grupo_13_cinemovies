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

//Ruta a JSONmovies
let movies = path.join(__dirname,"../datos/movies.json")

 function listMovies(){

    return JSON.parse(fs.readFileSync(movies, "utf-8")); 
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

        //console.log(jsonPeliculas);
       /*  let idAEditar = jsonPeliculas.find(jsonPeliculas => { 
            return jsonPeliculas.id == req.params.id
        });  */
        let peliAEditar = jsonPeliculas.find(jsonPeliculas => jsonPeliculas.id == idParams);

        //console.log(peliAEditar);
        //console.log(idAEditar);
        //console.log(req.params.id);
         res.render('editar_producto', {peliAEditar});
         //res.send(peliAEditar);
    },
    editar_producto(req,res){
        //Leemos las peliculas
       let jsonPeliculas = listMovies();
    
        //Buscamos la pelicula a editar
        let idParams = req.params.id; 
        //res.send(idParams)
        let peliAEditar = jsonPeliculas.find(peli => peli.id == idParams); 

        //console.log(idAEditar);
        //console.log(idParams);
        //console.log(req.params.id);
        if(typeof peliAEditar == "undefined" ){
            res.send("No se encontro la pelicula");
        }else{
            
            //Creamos la pelicula nueva que va a reemplazar(nos guardamos todos los datos que llegan por req.body)
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
                image: req.file != undefined ? req.file : peliAEditar.image,
                
            }
        
            //Buscamos la posisicon de la pelicula a reemplazar dentro del json
            let posicionPelicula = jsonPeliculas.findIndex(x => x.id == idParams)
            //console.log(posicionPelicula);
            
            //Reemplazamos 
            jsonPeliculas[posicionPelicula] = peliEditada;
    
            fs.writeFileSync(movies, JSON.stringify(jsonPeliculas, null, " "));
    
            res.redirect('/'); 
        } 
    
    
    }
    
}

module.exports = detalle_productoController;

//console.log(detalle_productoController.editar_producto());