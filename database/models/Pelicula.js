module.exports = (sequelize, dataTypes) => {
let alias= "Peliculas";
let cols = {
    id: {
        type: dataTypes.INTEGER,
        primaryKey: true,

    },
    title: {
        type: dataTypes.STRING,
    },
    year: {
        type: dataTypes.INTEGER,

    },
    premier: {
        
    },
    synopsis: {
        type: dataTypes.STRING
    },
    director: {
        type: dataTypes.STRING
    },
    cast: {
        type: dataTypes.STRING
    },
    rating: {
        tyoe: dataTypes.FLOAT
    },
    genre: {
        type: dataTypes.STRING
    },
    poster: {
        type: dataTypes.STRING
    },
    banner: {
        type: dataTypes.STRING
    },
    awars: {
        type: dataTypes.STRING
    },
    language: {
        type: dataTypes.STRING
    },
    datePremier: {
        type: dataTypes.DATE
    },
    idCategory: {
        type: dataTypes.INTEGER
    }


};

let config =  {
    tableName: "peliculas",
    timestamps: false
}


    const Pelicula = sequelize.define (alias, cols, config);

    return Pelicula;

}