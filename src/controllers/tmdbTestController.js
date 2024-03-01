// Por ahora estoy probando si va a servir!
// Quizas esta forma de modelar la clase Movie se puede adaptar a sequelize mas adelante

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const accessToken = fs.readFileSync(path.join(__dirname,'../datos/APIAuth.txt'),{'encoding':'utf-8'});
const omdbAPIKey = fs.readFileSync(path.join(__dirname,'../datos/omdbAPI.txt'),{'encoding':'utf-8'});
const {removeWhiteSpace} = require('../middlewares/funcs');
const { response } = require('express');
// const Peliculas = require("./database/models/Peliculas");
const db = require('../../database/models');
// Vars
const resLang = 'es-AR';
const movieID = 695721;
const trendingURL = `https://api.themoviedb.org/3/trending/movie/week?language=${resLang}&page=1`;
const movieDetailURL = `https://api.themoviedb.org/3/movie/${movieID}?language=${resLang}&append_to_response=release_dates,lists`;
const movieCreditsURL = `https://api.themoviedb.org/3/movie/${movieID}/credits`;
let generosTMDB =  //Para cuando cargamos a la base de datos nuestra! >> Usafo para mapear nuestro genero con el de ellos
    {
        'Acción': { tmdbID: 28 },
        'Aventura': { tmdbID: 12 },
        'Animación': { tmdbID: 16 },
        'Comedia': { tmdbID: 35 },
        'Crimen': { tmdbID: 80 },
        'Documental': { tmdbID: 99 },
        'Drama': { tmdbID: 18 },
        'Familia': { tmdbID: 10751 },
        'Fantasía': { tmdbID: 14 },
        'Historia': { tmdbID: 36 },
        'Terror': { tmdbID: 27 },
        'Música': { tmdbID: 10402 },
        'Misterio': { tmdbID: 9648 },
        'Romance': { tmdbID: 10749 },
        'Ciencia ficción': { tmdbID: 878 },
        'Película de TV': { tmdbID: 10770 },
        'Suspense': { tmdbID: 53 },
        'Bélica': { tmdbID: 10752 },
        'Western': { tmdbID: 37 }
    }
let i =1;
for (const key in generosTMDB) {
    generosTMDB[key]['id'] = i;
    i++;
}

// Funcion para retornar cualquier pedido de la API
async function getTmdbResponse(url) {
    const response = await axios(
        {
            method:'get',
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            accept: 'application/json'
        }
    )
    return response;
}
// Funcion para saber si una peli es estreno basado en el diferencial de la fecha actual con su release_date (Mejorar)
function isReleasingFromDateDiff(releaseDate) {
    let difference = Date.now() - releaseDate;
    let daysDifference = Math.floor(difference/1000/60/60/24);
    return daysDifference < 60; // 2 meses
}

// Funcion para obtener awards (de la otra API =/ )
async function getAwards(id) {
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${omdbAPIKey}`;
    const res = await axios.get(url);
    return res.data.Awards; //Depende de otra API. Buscar resolver si no anda!
}

async function getTrendingMovies() { //Para buscar una lista de pelis interesantes
    let res = await getTmdbResponse(trendingURL);
    let moviesList = res.data.results;
    console.log(moviesList);
}
async function getPopularMovies(nResults = 10) { //Peliculas aleatorias en la lista "popular"
    let n = 1;
    let ids = new Set();
    let popularURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${resLang}&sort_by=popularity.desc&region=AR`;
    // let popularURL = 
    try {
        var res = await getTmdbResponse(popularURL + `&page=1`);
    } catch(e) {
        console.log('Ha ocurrido un error al llamar a la API')
        return e;
    }
    const maxPage = 500; //Limite puesto por la API
    const randomPage = Math.floor(Math.random() * maxPage);
    try {
        let res = await getTmdbResponse(popularURL + `&page=${randomPage}`);
    } catch(e) {
        console.log('Ha ocurrido un error al llamar a la API (la 2da vez)') //
        return e;
    }
    let resNumber;
    let newId; 
    while (nResults>0) {
        resNumber = Math.floor(Math.random() * res.data.results.length);
        if (res.data.results[resNumber].id) {
            newId = res.data.results[resNumber].id;
            if (!(ids.has(newId))) { //Evitar duplicados
                ids.add(newId);
                nResults--;
            }
        }
    }
    return Array.from(ids);
}
// Buscar el id del genero que corresponda. Luego hacerlo con la base de datos!
function getGenreID(genre) {
    return generosTMDB[genre]['id'];
}

// Funciones para armar una pelicula con las responses
async function getMovieByID(id,responseLang ='es-AR',saveLocal = false)  {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?language=${responseLang}&append_to_response=release_dates,lists`;
    const languageMapping = { //No confundir con responseLang (que determina el idioma de la respuesta de la)
        'es': 'Español','en': 'Inglés','fr': 'Francés','de': 'Alemán',
        'it': 'Italiano','pt': 'Portugués','ja': 'Japonés','ko': 'Coreano',
      };
    const res = await getTmdbResponse(movieDetailURL);
    const usReleaseInfo = res.data.release_dates.results.find(relDate => relDate.iso_3166_1 == 'AR');
    let classification = usReleaseInfo ? usReleaseInfo.release_dates[0].certification : ''; // null?
    let origen = '';
    res.data.production_countries.forEach(country => { origen += `${country.name}, `}); 
    origen = origen.slice(0,-2); // Que no quede coma espacio al final
    let awards = await getAwards(res.data.imdb_id);
    // let posterPath = res.data.poster_path;
    // let backdropPath = res.data.backdrop_path;

    // try {
    //     saveImageToDisk(res.data.backdrop_path,localFileName); //Si no anda, va a retornar un error especifico
    // } catch(e) {
    //     console.log(e);
    //     localFileName = null; // No queremos guardar el nombre si no se guardo!
    // }
    let fecha_estreno = res.data.release_date;
    let poster, banner;
    if (saveLocal){ // Importante, decidir si la imagen va a tener una path local o no! Incluso crear una variable en la base de datos!
        let localFileName = removeWhiteSpace(res.data.title) + path.extname(res.data.backdrop_path);
        poster = `poster-${localFileName}`;
        banner = (+isReleasingFromDateDiff(Date.parse(fecha_estreno)) == 1)? `banner-${localFileName}` : ''; //Si no es estreno, no guardar banner!
    } else {
        poster = `https://image.tmdb.org/t/p/original${res.data.poster_path}`;
        banner = (+isReleasingFromDateDiff(Date.parse(fecha_estreno)) == 1)? `https://image.tmdb.org/t/p/original${res.data.backdrop_path}` : ''
    }
    return {
        titulo: res.data.title,
        fecha_estreno: fecha_estreno, //Luego manejar al mandar a la BD
        anio: new Date(Date.parse(res.data.release_date)).getFullYear(),
        es_estreno: +isReleasingFromDateDiff(Date.parse(fecha_estreno)), //Aparentemente ya el mas adelante convierte true en 1 y false en 0
        descripcion: res.data.overview,
        puntuacion: res.data.vote_average.toFixed(2),
        clasificacion: classification,
        duracion: res.data.runtime,
        origen: origen,
        poster: poster,
        banner: banner, //Si no es estreno, no guardar banner!
        awards: awards == null?'None':awards,
        idioma: languageMapping[res.data.original_language],
        id_categoria_pelicula:  getGenreID(res.data.genres[0].name), //Funcion para buscar el id del genero basado en res.data.genres[0].name (es distinto el id en la API). Chequear que vengan en castellano!
        local: saveLocal
    }
}
async function getMovieCreditsByID(id,n = 5) { //Trae los "n" actores principales (hay muchos)
    const movieCreditsURL = `https://api.themoviedb.org/3/movie/${id}/credits`;
    const res = await getTmdbResponse(movieCreditsURL);
    const director = res.data.crew.find(x => x.job == 'Director').name;
    // console.log(res.data.cast);
    let cast = res.data.cast.filter(actor => actor.order < n);
    cast = cast.map(actor => actor.name);
    // console.log(cast)
    return {'director':director,'reparto':cast.join(', ')};
};
async function getAwards(imdbID) {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbAPIKey}`;
    const res = await axios.get(url);
    return res.data.Awards; //Depende de otra API. Buscar resolver si no anda!
}
async function saveImageToDisk(remoteFileName,localFileName,dimensions = 'original',poster = true) {
    const localSavePath = path.resolve(__dirname,`../../public/images/${poster?'movies/poster-':'banners/banner-'}${localFileName}`);
    const posterImageURL = `https://image.tmdb.org/t/p/${dimensions}${remoteFileName}`;
    // const localSavePath = path.resolve(__dirname,`../../public/images/movies/poster-${localFileName}`);
    const res = await axios({
        method: 'GET',
        url: posterImageURL,
        responseType: 'stream',
    });
    const writer = fs.createWriteStream(localSavePath);
    res.data.pipe(writer);
    return new Promise((resolve,reject) => {
        writer.on('end',()=> {
            resolve() // Si termina la descarga con exito
        });
        writer.on('error', (e)=> {
            reject(e) // Si sale mal algo en la carga de la imagen
        });
    });
}

//###Algunos comentarios###
//Para obtener la clave de API hay que crearse una cuenta y especificar la aplicacion (con su desc., url, etc.) 
// Para no dejar mi auth token en github, lo importo al controller. Hay que crear un archivo "APIAuth.txt" en "datos" con uno por cada persona
// Podemos pedir las pelis "trending" de la semana a traves del URL "https://api.themoviedb.org/3/trending/movie/{time-window}"
// Para conseguir la respuesta en otro idioma, hay que agregar "?language={lang-country}" en codigo ISO 639-1 del idioma-pais
// Enfoque OOP
// Pelicula en particular
class Movie {
    constructor(data) {
        const movieModelProps = ['titulo','fecha_estreno','anio','es_estreno','descripcion','puntuacion',
        'clasificacion','duracion','origen','poster','banner','awards','idioma','id_categoria_pelicula','director','reparto','local'];
        try {
            if ((data === null) || (typeof data !== 'object'))  {
                throw new Error('Debe pasar un objeto al constructor de la clase Movie')
            }
            for (const prop of movieModelProps) {
                if (!(prop in data)) {
                    throw new Error(`Error en la estructura de la pelicula. Parece que falta la propiedad "${prop}"`)
                }
            }
            for (const incomingProp in data) {
                if (!(movieModelProps.includes(incomingProp))) {
                    throw new Error(`Error en la estructura de la pelicula. La propiedad "${incomingProp}" no es parte del modelo de pelicula`)
                }
            }
            Object.assign(this,data);
        } catch(e) {
            console.log(e);
        }
    };
    getStringRepr() {
        try {
            if (this) {
                let strRepr =`(`;
                for (const prop in this) {
                    strRepr += `'${this[prop]}', `; //Chequear que hayan comillas!
                }
                return strRepr.slice(0,-2) + `)`;
            } else {
                throw new Error('Hubo un error al convertir en string. Chequee la estructura de su dato.');
            }
        } catch(e) {
            console.log(e);
        }

    };
    async insertIntoDataBase() {
        try {
            if (this.local) {
                saveImageToDisk(this.poster);
                if (this.es_estreno) {
                    saveImageToDisk(this.banner);
                }
            }
            delete this.local; //No queremos que vaya a la DB por ahora
            return await db.Peliculas.create(this);
        } catch(e) {
            // Remover la imagen del disco
            throw e;
        }
    }
}


// ###############################
//Testing >>
// getTrendingMovies();

async function getEstrenos(maxN = 10) { // Trae los estrenos de Argentina (actualmente en cines)
    let today = new Date();
    let nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    // console.log(nextWeek)
    nextWeek = nextWeek.toISOString().split('T')[0];
    let twoMonthsBefore = new Date();
    twoMonthsBefore.setMonth(today.getDate() -60);
    twoMonthsBefore = twoMonthsBefore.toISOString().split('T')[0];
    let firstResponse = await getTmdbResponse(`https://api.themoviedb.org/3/movie/now_playing?language=es-AR&page=1&region=AR&sort_by=popularity.desc&release_date.lte=${twoMonthsBefore}&with_release_type=1`);
    let n_pages = firstResponse.data.total_pages
    let res;
    let movieIds = [];
    while (maxN > 0) {
        for (let i = 0; i < n_pages; i++) {
            res = await getTmdbResponse(`https://api.themoviedb.org/3/movie/now_playing?language=es-AR&page=${i+1}&region=AR&sort_by=popularity.desc&release_date.lte=${twoMonthsBefore}&with_release_type=1`);
            for (const movie of res.data.results) {
                
                if (maxN == 0) {
                    break;
                }
                maxN--;
                movieIds.push({
                    'id': movie.id,
                    'title':movie.title
                });
            }
        }
        break; // En caso de que no alcancen las pelis (el total es menor a maxN)
    }
    return movieIds;
}
async function getClassics(maxN=20) {
    maxN = maxN > 100? 100 : maxN; // Por las dudas
    let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`;
    let i = 1;
    // let res = await getTmdbResponse(url + `&page=${i}`)
    // console.log('RELEASE#########################')
    // console.log(res.data)
    let res;
    let releaseDates;
    let movieIds = [];    
    while (maxN > 0) {
        res = await getTmdbResponse(url + `&page=${i}`);
        // console.log('Length', res.data.results.length)
        setTimeout(() => {console.log('Pausando...')},2000); //No sobrecargar la API!
        for (const movie of res.data.results) { //TIene 20 results como maximo!
            // console.log('MOVIE',movie);
            if (maxN == 0) {
                break;
            }
            individualMovieResponse = await getTmdbResponse(`https://api.themoviedb.org/3/movie/${movie.id}?language=es-AR&append_to_response=release_dates`);
            releaseDates = individualMovieResponse.data.release_dates.results;
            var releaseDate = Date.parse(movie.release_date); //Uso var para poder definirlo en cada iteracion
            // console.log(releaseDate);
            // if (releaseDates.find(relDate => relDate['iso_3166_1'] == 'AR') & !(isReleasingFromDateDiff(releaseDate))){ //Estrenada en Arg y hace mas de 2 meses
            if (!(isReleasingFromDateDiff(releaseDate))){ //Le cuesta encontrar muchos con release date en AR... 
                            
                // console.log(movie)
                movieIds.push({
                    'id': movie.id,
                    'title':movie.title
                });
                maxN--
            }
            // maxN--
        }
    }
    return movieIds;
}

const tmdbController = {
    async rellenarDB(req,res) { 
        const clasicosIds = [
            { id: 1072790, title: 'Anyone But You' },
            { id: 792307, title: 'Poor Things' },
            { id: 940551, title: 'Migration' },
            { id: 949429, title: 'The Adventures' },
            { id: 1211483, title: 'Skal - Fight for Survival' },
            { id: 609681, title: 'The Marvels' },
            { id: 787699, title: 'Wonka' },
            { id: 438631, title: 'Dune' },
            { id: 572802, title: 'Aquaman and the Lost Kingdom' },
            { id: 980137, title: 'Dad or Mom' },
            { id: 1183905, title: 'Trunk - Locked In' },
            { id: 1022796, title: 'Wish' },
            { id: 1072790, title: 'Anyone But You' },
            { id: 792307, title: 'Poor Things' },
            { id: 940551, title: 'Migration' },
            { id: 949429, title: 'The Adventures' },
            { id: 1211483, title: 'Skal - Fight for Survival' },
            { id: 609681, title: 'The Marvels' },
            { id: 787699, title: 'Wonka' },
            { id: 438631, title: 'Dune' }
          ];
        const estrenosIds = [
            { id: 792307, title: 'Pobres criaturas' },
            { id: 693134, title: 'Dune: Parte dos' },
            { id: 673593, title: 'Chicas malas' },
            { id: 634492, title: 'Madame Web' },
            { id: 915935, title: 'Anatomía de una caída' },
            { id: 365620, title: 'Ferrari' },
            { id: 666277, title: 'Vidas pasadas' },
            { id: 840430, title: 'Los que se quedan' },
            { id: 839369, title: 'Secretos de un escándalo' },
            { id: 1130053, title: "Cinderella's Curse" },
            { id: 1217409, title: 'Jaque Mate' },
            { id: 1202087, title: 'Cierren los ojos: La final eterna' },
            { id: 1229873, title: 'Luces azules' },
            { id: 1245241, title: 'Paisaje' },
            { id: 1044920, title: 'La memoria que habitamos' },
            { id: 1244034, title: 'Bocanada Interpersonal' },
            { id: 1204367, title: 'Las Escondidas' },
            {
              id: 1238612,
              title: 'Desiderio: Reflexiones sobre un autorretrato'
            },
            { id: 1241611, title: 'Anhelos' },
            { id: 1245239, title: 'Entremedio' }
          ];
        // Si hay que redefinir los ids, descomentar lo de abajo!
        // const clasicosIds = await getClassics();
        // const estrenosIds = await getEstrenos();
        let newMovie,newCredits,match;
        let nuevosIds = new Set([...clasicosIds,...estrenosIds]);

        for (const movie of Array.from(nuevosIds)) {
            match = await db.Peliculas.findOne({
                where: {titulo: movie.title}
            });
            if (!match) {
                try {
                    newMovie = await getMovieByID(movie.id);
                    newCredits = await getMovieCreditsByID(movie.id);
                    var movieInst = new Movie({...newMovie,...newCredits});
                    movieInst.insertIntoDataBase(); 
                    console.log('Creando registro para peli con tmdbi:' + movie.id);
                } catch(e){ //Luego pensar otra logica!
                    console.log(e);
                }
            }
            else {
                console.log('Peli ' + movie.id + 'ya existe en la base de datos');
            }
        }
        res.send('Base de datos actualizada!');
        console.log('Base de datos actualizada!')
        // Col unica titulo? Deberia ser 
    }
}
module.exports = tmdbController;



console.log('#####################\n\n\n\n\n\n\n###############')
async function testingFunc() {
    // let newIds = await getEstrenos(20);
    // let classics = await getClassics(20);
    // console.log(newIds)
    // console.log(classics)
    let newMovie = await getMovieByID(792307)
    // console.log(newMovie);
    return
    for (const id of newIds) {
        // var movie = await getMovieByID(id);
        var movie = await getTmdbResponse(`https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=release_dates,lists`)
        console.log(movie.data.release_date);
        console.log('\nEs estreno>',isReleasingFromDateDiff(Date.parse(movie.data.release_date)));
    }
    // await getClassics();
    // let classics = await getClassics();
    // let movieData = await getMovieByID(940551);

    // console.log(newIds)
}
// testingFunc()

