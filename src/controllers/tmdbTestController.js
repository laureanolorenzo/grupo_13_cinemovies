// Por ahora estoy probando si va a servir!
// Quizas esta forma de modelar la clase Movie se puede adaptar a sequelize mas adelante
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config('../../src/');
let accessToken = fs.readFileSync(path.join(__dirname,'../datos/APIAuth.txt'),{'encoding':'utf-8'});

if (!accessToken) {
    accessToken = process.env.TMDB_API_KEY
}


let omdbAPIKey = fs.readFileSync(path.join(__dirname,'../datos/omdbAPI.txt'),{'encoding':'utf-8'});
if (!omdbAPIKey) {
    omdbAPIKey = process.env.OMDB_API_KEY;
}
console.log(accessToken)
const {removeWhiteSpace} = require('../middlewares/funcs');
const { response } = require('express');
// const Peliculas = require("./database/models/Peliculas");
const db = require('../../database/models');
// Vars
const resLang = 'es-AR';
const trendingURL = `https://api.themoviedb.org/3/trending/movie/week?language=${resLang}&page=1`;
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
async function checkUpcomingFit(result) {
    let resultInDb = await db.Peliculas.findOne(
        {where: {tmdb_id : result.id}}
    )
    let today = new Date();
    let releaseDate = new Date(result.release_date);
    let released = today > releaseDate;
    resultInDb = resultInDb != null;
    if (!result.title || !result.poster_path || !(['en','es'].includes(result.original_language)) || resultInDb) {
        return false
    }
    return true
    
}
// Buscar el id del genero que corresponda. Luego hacerlo con la base de datos!
async function getGenreID(genre) {
    let categ = await db.categorias_peliculas.findOne(
        {where: {titulo: genre}}
    );
    return categ.id;
}
// Funciones para armar una pelicula con las responses
async function getMovieByID(id,responseLang ='es-AR',saveLocal = false)  {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?language=${responseLang}&append_to_response=release_dates,lists`;
    const languageMapping = { //No confundir con responseLang (que determina el idioma de la respuesta de la)
        'es': 'Español','en': 'Inglés','fr': 'Francés','de': 'Alemán',
        'it': 'Italiano','pt': 'Portugués','ja': 'Japonés','ko': 'Coreano',
      };
    const res = await getTmdbResponse(movieDetailURL);
    let releaseInfo = res.data.release_dates.results.find(relDate => relDate.iso_3166_1 == 'AR');
    if (!releaseInfo) {
        releaseInfo = res.data.release_dates.results.find(relDate => relDate.iso_3166_1 == 'US');
    }
    let classification = releaseInfo ? releaseInfo.release_dates[0].certification : null; // null?
    let origen = '';
    res.data.production_countries.forEach(country => { origen += `${country.name}, `}); 
    origen = origen.slice(0,-2); // Que no quede coma espacio al final
    let awards = await getAwards(res.data.imdb_id);
    let fecha_estreno = res.data.release_date;
    let poster, banner;
    if (saveLocal){ // Importante, decidir si la imagen va a tener una path local o no! Incluso crear una variable en la base de datos!
        let localFileName = removeWhiteSpace(res.data.title) + path.extname(res.data.backdrop_path);
        
        banner = (+isReleasingFromDateDiff(Date.parse(fecha_estreno)) == 1)? `banner-${localFileName}` : null; //Si no es estreno, no guardar banner!
    } else {
        poster = res.data.poster_path?`https://image.tmdb.org/t/p/original${res.data.poster_path}`:null;
        banner = (+isReleasingFromDateDiff(Date.parse(fecha_estreno)) == 1)&&(res.data.backdrop_path)? `https://image.tmdb.org/t/p/original${res.data.backdrop_path}` : null;
        // if (origen == 'Argentina') {
        //     banner = null; //Las de Arg pueden venir en mala calidad!
        // }
    } //Banner queremos si: 1) es estreno y 2) tiene banner! (Las pelis Arg. suelen no tener)
    poster = res.data.poster_path?poster:null;
    return {
        titulo: res.data.title,
        fecha_estreno: fecha_estreno, //Luego manejar al mandar a la BD
        anio: new Date(Date.parse(res.data.release_date)).getFullYear(),
        es_estreno: +isReleasingFromDateDiff(Date.parse(fecha_estreno)), //Aparentemente ya el mas adelante convierte true en 1 y false en 0
        descripcion: res.data.overview,
        puntuacion: res.data.vote_average.toFixed(2),
        clasificacion: classification?classification:'N/A',
        duracion: res.data.runtime,
        origen: origen,
        poster: poster,
        banner: banner, //Si no es estreno, no guardar banner!
        awards: awards == null?'N/A':awards,
        idioma: languageMapping[res.data.original_language],
        id_categoria_pelicula:  await getGenreID(res.data.genres[0].name), //Funcion para buscar el id del genero basado en res.data.genres[0].name (es distinto el id en la API). Chequear que vengan en castellano!
        local: +saveLocal, //Luego se borra esta propiedad antes de mandar a la base de datos
        tmdb_id: res.data.id
    }
}
async function getMovieCreditsByID(id,n = 5) { //Trae los "n" actores principales (hay muchos)
    const movieCreditsURL = `https://api.themoviedb.org/3/movie/${id}/credits`;
    const res = await getTmdbResponse(movieCreditsURL);
    const director = res.data.crew.find(x => x.job == 'Director').name;
    let cast = res.data.cast.filter(actor => actor.order < n);
    cast = cast.map(actor => actor.name);
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
        'clasificacion','duracion','origen','poster','banner','awards','idioma','id_categoria_pelicula','director','reparto','local','tmdb_id'];
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
            return await db.Peliculas.create(this);
        } catch(e) {
            // Remover la imagen del disco
            throw e;
        }
    }
}
// ###############################
//Testing >>
async function getEstrenos(maxN = 10) { // Trae los estrenos de Argentina (actualmente en cines)
    let today = new Date();
    let nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
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
                movieIds.push(movie.id);
            }
        }
        break; // En caso de que no alcancen las pelis (el total es menor a maxN)
    }
    return movieIds;
}
async function getClassics(maxN=2) {
    maxN = maxN > 100? 100 : maxN; // Por las dudas
    let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`;
    let i = 1;
    let res;
    let releaseDates;
    let movieIds = [];    
    while (maxN > 0) {
        res = await getTmdbResponse(url + `&page=${i}`);
        setTimeout(() => {console.log('Pausando...')},2000); //No sobrecargar la API!
        for (const movie of res.data.results) { //TIene 20 results como maximo!
            if (!(['en','es'].includes(movie.original_language))) {
                continue
            }
            if (maxN == 0) {
                break;
            }
            individualMovieResponse = await getTmdbResponse(`https://api.themoviedb.org/3/movie/${movie.id}?language=es-AR&append_to_response=release_dates`);
            releaseDates = individualMovieResponse.data.release_dates.results;
            var releaseDate = Date.parse(movie.release_date); //Uso var para poder definirlo en cada iteracion
            if (!(isReleasingFromDateDiff(releaseDate))){ //Le cuesta encontrar muchos con release date en AR... 
                movieIds.push(movie.id);
                maxN--
            }
        }
    }
    return movieIds;
}

const tmdbController = {
    async rellenarDB(req,res) { 
        const clasicosIds = [
            1072790,  792307, 940551,
            1211483,  609681, 787699,
             438631,  572802, 980137,
            1022796, 1072790, 792307,
             940551, 1211483, 609681,
             787699,  438631, 572802,
             980137, 1022796
        ];
        const estrenosIds = [
            792307,  693134,  673593,
            634492,  915935,  365620,
            666277,  840430,  839369,
           1130053, 1217409, 1202087,
           1229873, 1245241, 1044920,
           1244034, 1204367, 1238612,
           1241611, 1245239,1011985
        ];
        // Si hay que redefinir los ids, descomentar lo de abajo!
        // const clasicosIds = await getClassics();
        // const estrenosIds = await getEstrenos();
        let newMovie,newCredits,match;
        let nuevosIds = new Set([...clasicosIds,...estrenosIds]);
        for (const id of Array.from(nuevosIds)) {
            match = await db.Peliculas.findOne({
                where: {tmdb_id: id}
            });
            if (!match) {
                try {
                    newMovie = await getMovieByID(id);
                    newCredits = await getMovieCreditsByID(id);
                    var movieInst = new Movie({...newMovie,...newCredits});
                    if (movieInst.poster && movieInst.titulo) {
                        movieInst.insertIntoDataBase();
                        console.log('Creando registro para peli con tmdbi:' + id); 
                    }
                } catch(e){ //Luego pensar otra logica!
                    console.log(e);
                }
            }
            else {
                console.log('Peli ' + id + 'ya existe en la base de datos');
            }
        }
        res.send('Base de datos actualizada!');
        console.log('Base de datos actualizada!')
    },
    async getUpcoming(req,res) {
        const fechaHoy = new Date();
        const anio = fechaHoy.getFullYear();
        const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaHoy.getDate()).padStart(2, '0');
        min_date = `${anio}-${mes}-${dia}`;
        // const url = `https://api.themoviedb.org/3/movie/upcoming?language=es-AR&page=1&sort_by=primary_release_date.desc`;
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-AR&page=1&sort_by=popularity.desc&&primary_release_date.gte=${min_date}`
        const response = await getTmdbResponse(url);
        var upcomingMovies = [];
        for (const result of response.data.results) {
            // if (result.title && result.poster_path && ['en','es'].includes(result.original_language)) {
            //     console.log('---------------------------------')
            //     console.log(upcomingMovies.length)
            if (await checkUpcomingFit(result)) {
                if (upcomingMovies.length < 8) {
                    upcomingMovies.push({
                        'tmdbId':result.id,
                        'titulo':result.title,
                        'poster': `https://image.tmdb.org/t/p/original${result.poster_path}`,
                        'fecha_estreno': result.release_date
                    });
                } else {
                    break;
                }
            }
        }
    // console.log(upcomingMovies)
    res.json(upcomingMovies);
    }
}
module.exports = tmdbController;



console.log('#####################\n\n\n\n\n\n\n###############')
async function testingFunc() {
    // let movies = await getClassics(20)
    // let est = await getEstrenos(20)
    let url = `https://api.themoviedb.org/3/movie/upcoming?language=es-AR&page=1&sort_by=popularity.desc`;
    let res = await getTmdbResponse(url);
    console.log(res.data.results)
//     console.log('Clasicos',movies)
//     console.log('Estrenos',est)
}
// testingFunc()
