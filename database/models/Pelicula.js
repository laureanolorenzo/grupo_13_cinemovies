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


};

let config =  {
    tableName: "peliculas",
    timestamps: false
}


    const Pelicula = sequelize.define (alias, cols, config);

    return Pelicula;

}