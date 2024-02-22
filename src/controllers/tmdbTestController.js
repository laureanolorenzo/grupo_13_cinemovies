// Por ahora estoy probando si va a servir!
// Quizas esta forma de modelar la clase Movie se puede adaptar a sequelize mas adelante

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const accessToken = fs.readFileSync(path.join(__dirname,'../datos/APIAuth.txt'),{'encoding':'utf-8'});
const omdbAPIKey = fs.readFileSync(path.join(__dirname,'../datos/omdbAPI.txt'),{'encoding':'utf-8'});
const {removeWhiteSpace} = require('../middlewares/funcs');
const { response } = require('express');
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
    return daysDifference < 180; // 6 meses
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
    let popularURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${resLang}&sort_by=popularity.desc`;
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
async function getMovieByID(id,responseLang ='es-AR')  {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?language=${responseLang}&append_to_response=release_dates,lists`;
    const languageMapping = { //No confundir con responseLang (que determina el idioma de la respuesta de la)
        'es': 'Español','en': 'Inglés','fr': 'Francés','de': 'Alemán',
        'it': 'Italiano','pt': 'Portugués','ja': 'Japonés','ko': 'Coreano',
      };
    const res = await getTmdbResponse(movieDetailURL);
    const usReleaseInfo = res.data.release_dates.results.find(relDate => relDate.iso_3166_1 == 'US');
    let classification = usReleaseInfo['release_dates'][0].certification; //Asi viene de la API
    let origen = '';
    res.data.production_countries.forEach(country => { origen += `${country.name}, `}); 
    origen = origen.slice(0,-2); // Que no quede coma espacio al final
    let awards = await getAwards(res.data.imdb_id);
    let localFileName = removeWhiteSpace(res.data.title) + path.extname(res.data.backdrop_path);
    try {
        savePosterToDisk(res.data.backdrop_path,localFileName); //Si no anda, va a retornar un error especifico
    } catch(e) {
        console.log(e);
        localFileName = null; // No queremos guardar el nombre si no se guardo!
    }
    let fecha_estreno = res.data.release_date;
    return {
        titulo: res.data.title,
        fecha_estreno: fecha_estreno, //Luego manejar al mandar a la BD
        anio: new Date(Date.parse(res.data.release_date)).getFullYear(),
        es_estreno: +isReleasingFromDateDiff(fecha_estreno), //Aparentemente ya el mas adelante convierte true en 1 y false en 0
        descripcion: res.data.overview,
        puntuacion: res.data.vote_average.toFixed(2),
        clasificacion: classification,
        duracion: res.data.runtime,
        origen: origen,
        poster: localFileName,
        banner: localFileName,
        awards: awards == null?'Ninguno':awards,
        idioma: languageMapping[res.data.original_language],
        id_categoria_pelicula:  getGenreID(res.data.genres[0].name) //Funcion para buscar el id del genero basado en res.data.genres[0].name (es distinto el id en la API). Chequear que vengan en castellano!
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
async function savePosterToDisk(remoteFileName,localFileName,dimensions = 'original') {
    let imageURL = `https://image.tmdb.org/t/p/${dimensions}${remoteFileName}`;
    const localSavePath = path.resolve(__dirname,`../../public/images/movies/tmdb/${localFileName}`);
    const res = await axios({
        method: 'GET',
        url: imageURL,
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
        'clasificacion','duracion','origen','poster','banner','awards','idioma','id_categoria_pelicula','director','reparto'];
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

    }
}


// ###############################
//Testing >>
// getTrendingMovies();
console.log('#####################\n\n\n\n\n\n\n###############')
async function testingFunc(id) {
    //En esta func. se mandarian a la base de datos

    // const newMovie = await getMovieByID(id);
    // const credits = await getMovieCreditsByID(id);
    // let movieInstance = new Movie({...newMovie,...credits})
    // console.log(movieInstance)
    // console.log(movieInstance.getStringRepr());
    let popMovies = await getPopularMovies(5);
    console.log(popMovies);
    
}
testingFunc()

// fetchMovie(753342);
// getPopularMovies();

// savePosterToDisk()

// getMovieByID();
// getAwards('tt10545296');
// getMovieCreditsByID();
// console.log(isReleasingFromDateDiff(Date.parse('2021-11-15')));

// Generar el insert de categorias
let insertCategoriasStatement = 
`INSERT INTO categorias_peliculas (categoria) 
VALUES `
for (const key in generosTMDB) {
    insertCategoriasStatement += (`('${key}'),\n`)
}

let a = new Set();

a.add('2');
a.add('4');
console.log(a.has('2'));
console.log(Math.floor(Math.random() * 12000));
