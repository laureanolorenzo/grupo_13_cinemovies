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
        res.render('detalle_producto' , {datos: movieToShow, idPelicula: idPelicula, user: req.session.userLoggedIn});
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
        let peliAEditar = jsonPeliculas.find(jsonPeliculas => jsonPeliculas.id == idParams);

         res.render('editar_producto', {peliAEditar:peliAEditar,estructuraMovie:estructuraMovie, user: req.session.userLoggedIn });

    },
    editar_producto(req,res){

       let jsonPeliculas = listMovies();
    

        let idParams = req.params.id; 
        let peliAEditar = jsonPeliculas.find(peli => peli.id == idParams); // La peli en su estado anterior

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
                image: peliAEditar.image // Luego se va a sobreescribir si llegan imagenes.
                
            }
            // Si llegan imagenes, si llega imagen, reemplazarla. Y si llega banner, reemplazarlo.
            if (Object.keys(req.files).length !== 0) {
                // return res.send(req.files);
                const file = req.files;
                const imagesPath = path.resolve(__dirname,'../../public/images/movies');
                const bannerPath = path.resolve(__dirname,'../../public/images/movies'); // Por ahora lo dejamos asi. Luego ver la forma de guardar 2 archivos en carpetas separadas.
                if (file.image) {
                    if (peliAEditar.image) { // Borrar la imagen ya existente para no acumular archivos
                        fs.unlinkSync(`${imagesPath}/${peliAEditar.image}`);
                    }
                    peliEditada['image'] = file.image[0].filename ; // Reemplazar el nombre en el json para que luego ejs pueda referenciarlo
                }
                if (peliAEditar.banner) { 
                    peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : peliAEditar.banner;
                    if (peliAEditar.banner != 'defaultBanner.jpg') { // Creo que se podria hacer con otra logica mejor
                        fs.unlinkSync(`${bannerPath}/${peliAEditar.banner}`)// Borrar el banner si tenia uno
                    }

                } else { //Si no habia banner y no llega, poner "defaultBanner.jpg"
                    peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : 'defaultBanner.jpg'; // Crearlo mas tarde
                }
            // } else {
            //     // return res.send(req.body)
            //     // res.send('Hubo un error al procesar los archivos')
            };

            let posicionPelicula = jsonPeliculas.findIndex(x => x.id == idParams)
            jsonPeliculas[posicionPelicula] = peliEditada;
            fs.writeFileSync(moviesPath, JSON.stringify(jsonPeliculas, null, " "));

            res.redirect('/'); 
        } 
    
    
    }
    
}

module.exports = detalle_productoController;

//console.log(detalle_productoController.editar_producto());