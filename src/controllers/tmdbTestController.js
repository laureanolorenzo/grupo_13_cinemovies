// Por ahora estoy probando si va a servir!

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const accessToken = fs.readFileSync(path.join(__dirname,'../datos/APIAuth.txt'),{'encoding':'utf-8'});
const omdbAPIKey = fs.readFileSync(path.join(__dirname,'../datos/omdbAPI.txt'),{'encoding':'utf-8'});
// Vars
const resLang = 'es-AR'
const movieID = 695721;
const trendingURL = `https://api.themoviedb.org/3/trending/movie/week?language=${resLang}&page=1`;
const movieDetailURL = `https://api.themoviedb.org/3/movie/${movieID}?language=${resLang}&append_to_response=release_dates,lists`;
const movieCreditsURL = `https://api.themoviedb.org/3/movie/${movieID}/credits`;

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

async function getTrendingMovies() {
    let res = await getTmdbResponse(trendingURL);
    let moviesList = res.data.results;
    console.log(moviesList);
    
}

//###Algunos comentarios###
//Para obtener la clave de API hay que crearse una cuenta y especificar la aplicacion (con su desc., url, etc.) 
// Para no dejar mi auth token en github, lo importo al controller. Hay que crear un archivo "APIAuth.txt" en "datos" con uno por cada persona
// Podemos pedir las pelis "trending" de la semana a traves del URL "https://api.themoviedb.org/3/trending/movie/{time-window}"
// Para conseguir la respuesta en otro idioma, hay que agregar "?language={lang-country}" en codigo ISO 639-1 del idioma-pais



// Enfoque OOP
// Pelicula en particular
class Movie {
    // Usar el otro constructor!
    constructor(id,responseLang = 'es-AR') {
        this.id = id;
        this.responseLang = responseLang;
    }
    static async getMovieByID(id,responseLang) {
        const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?language=${responseLang}&append_to_response=release_dates,lists`;
        const languageMapping = { //No confundir con responseLang (que determina el idioma de la respuesta de la API)
            'es': 'Español','en': 'Inglés','fr': 'Francés','de': 'Alemán',
            'it': 'Italiano','pt': 'Portugués','ja': 'Japonés','ko': 'Coreano',
          };
        const res = await getTmdbResponse(movieDetailURL);
        const usReleaseInfo = res.data.release_dates.results.find(relDate => relDate.iso_3166_1 == 'US');
        let classification = usReleaseInfo['release_dates'][0].certification; //Asi viene de la API
        let origen = '';
        res.data.production_countries.forEach(country => { origen += `${country.name}, `}); 
        origen = origen.slice(0,-2); // Que no quede coma espacio al final
        let awards = await Movie.getAwards(res.data.imdb_id);
        return {
            titulo: res.data.title,
            fecha_estreno: res.data.release_date, //Luego manejar al mandar a la BD
            anio: new Date(Date.parse(res.data.release_date)).getFullYear(),
            es_estreno: +isReleasingFromDateDiff(this.fecha_estreno), //Aparentemente ya el mas adelante convierte true en 1 y false en 0
            descripcion: res.data.overview,
            puntuacion: res.data.vote_average.toFixed(2),
            clasificacion: classification,
            duracion: res.data.runtime,
            origen: origen,
            poster: '',
            banner: '',
            awards: awards,
            idioma: languageMapping[res.data.original_language],
            id_categoria_pelicula:  '' //Funcion para buscar el id del genero basado en res.data.genres[0].name (es distinto el id en la API)
        }
    };
    static async getMovieCreditsByID(id,n = 5) { //Trae los "n" actores principales (hay muchos)
        const movieCreditsURL = `https://api.themoviedb.org/3/movie/${id}/credits`;
        const res = await getTmdbResponse(movieCreditsURL);
        const director = res.data.crew.find(x => x.job == 'Director').name;
        // console.log(res.data.cast);
        let cast = res.data.cast.filter(actor => actor.order < n);
        // console.log(cast)
        return {'director':director,'reparto':cast.map(actor => actor.name).join(', ')};
    };
    static async getAwards(imdbID) {
        const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbAPIKey}`;
        const res = await axios.get(url);
        return res.data.Awards; //Depende de otra API. Buscar resolver si no anda!
    }
    static async asyncInitialize(id,responseLang = null) {
        if (!responseLang) {
            responseLang = 'es-AR';
        }
        try {
            let movie = await Movie.getMovieByID(id,responseLang);
            let cast = await Movie.getMovieCreditsByID(id,responseLang);
            Object.assign(this,{...movie,...cast});
        } catch (e) {
            throw new Error('Ha ocurrido un problema con la API de tmdb');
        }
        return this;
    }
}
//Testing >>
// getTrendingMovies();
console.log('#####################\n\n\n\n\n\n\n###############')
async function fetchMovie() {
    //En esta func. se mandarian a la base de datos
    let randomMovie = await Movie.asyncInitialize(1056360);
    console.log(randomMovie);
}
fetchMovie() 
// console.log(randomMovie)

// let vote = 2;
// console.log(vote.toFixed(2))
// getMovieByID();
// getAwards('tt10545296');
// getMovieCreditsByID();
// getMovieByID()
// console.log(isReleasingFromDateDiff(Date.parse('2021-11-15')));