const db = require("./database/models");


// async function findPelis() {
//     const pelis = await db.Peliculas.findAll();
//     console.log(pelis);
// }
// findPelis()


async function createCategoria() {
    // const nueva_peli = await db.categorias_peliculas.create({
    //     categoria: "Acción",
    //     poster: "vacio"
    // })
    const movie = await db.Peliculas.findOne({
        where: {titulo:'Pobres criaturas'}
    })
    console.log(movie)
}

createCategoria();

console.log()

// console.log(db.categorias_peliculas.findAll());
// console.log(db.funciones.findAll());
// console.log(db.roles.findAll());
// console.log(db.Usuarios.findAll());