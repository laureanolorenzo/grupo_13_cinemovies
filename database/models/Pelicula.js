module.exports = (sequelize, dataTypes) => {
let alias= "Peliculas";
let cols = {
    id: {
        type: dataTypes.INTEGER,
        primaryKey: true,

    },
    titulo: {
        type: dataTypes.STRING,
    },
    anio: {
        type: dataTypes.INTEGER,

    },
    es_estreno: {
        type: dataTypes.TINYINT
    },
    descripcion: {
        type: dataTypes.STRING
    },
    director: {
        type: dataTypes.STRING
    },
    reparto: {
        type: dataTypes.STRING
    },
    puntuacion: {
        type: dataTypes.FLOAT
    },
    clasificacion: {
        type: dataTypes.STRING
    },
    poster: {
        type: dataTypes.STRING
    },
    banner: {
        type: dataTypes.STRING
    },
    awards: {
        type: dataTypes.STRING
    },
    idioma: {
        type: dataTypes.STRING
    },
    fecha_estreno: {
        type: dataTypes.DATE
    },
    origen: {
        type: dataTypes.INTEGER
    },
    duracion: {
        type: dataTypes.STRING
    },
    id_categoria_pelicula: {
        type: dataTypes.INTEGER
    },
    tmdb_id: {
        type: dataTypes.INTEGER
    },
    local: {
        type: dataTypes.TINYINT
    }


};

let config =  {
    tableName: "peliculas",
    timestamps: false
}


    const Pelicula = sequelize.define(alias, cols, config);

    Pelicula.associate = function(models) {
        Pelicula.belongsTo(models.categorias_peliculas, {
            foreignKey: 'id_categoria_pelicula',
            as: 'categoria'
    })}

    return Pelicula;

}