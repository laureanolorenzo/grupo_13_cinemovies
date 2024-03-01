const fs = require('fs');
const path = require('path');

let moviesPath = path.join(__dirname,"../datos/movies.json");

// Variables
let anio = [];
for (let i = 1980; i <= 2023; i++) { //Hacer mas dinamico
    anio.push(i)
}
const ratingsMap = {
    '1' : '★☆☆☆☆',
    '2' : '★★☆☆☆',
    '3' : '★★★☆☆',
    '4' : '★★★★☆',
    '5' : '★★★★★',
}
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
let d =1;
for (const key in generosTMDB) {
    generosTMDB[key]['id'] = d;
    d++;
}
// Funciones utiles
function listCategories() {
    const categories = JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
    return categories.map(x => x['title']);
}
function listMovies(){
    return JSON.parse(fs.readFileSync(moviesPath, "utf-8")); 
}
function listCategories() {
    const categories = JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
    return categories.map(x => x['title']);
}
function removeWhiteSpace(str) {
	let forbiddenChars = ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '=',':','.'];
    let strArray = str.split(' ');
    let strArrayToCapitalize = strArray.slice(1);
    strArrayToCapitalize = strArrayToCapitalize.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    let newStr = strArray[0].concat(strArrayToCapitalize);
	for (const i of forbiddenChars) {
		newStr = newStr.replace(i,'_');
	}
	return newStr;
}

module.exports = {anio,listCategories,ratingsMap,listCategories,listMovies,removeWhiteSpace,moviesPath};
