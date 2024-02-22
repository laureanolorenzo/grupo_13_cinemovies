const fs = require('fs');
const path = require('path');

let moviesPath = path.join(__dirname,"../datos/movies.json");

// Variables
let anio = [];
for (i = 1980; i <= 2023; i++) { //Hacer mas dinamico
    anio.push(i)
}
const ratingsMap = {
    '1' : '★☆☆☆☆',
    '2' : '★★☆☆☆',
    '3' : '★★★☆☆',
    '4' : '★★★★☆',
    '5' : '★★★★★',
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
