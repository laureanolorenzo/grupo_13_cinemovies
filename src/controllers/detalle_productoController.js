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
    }
}

module.exports = detalle_productoController;