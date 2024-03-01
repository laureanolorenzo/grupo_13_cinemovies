module.exports = (sequelize, dataTypes) => {
    const CategoriaPelicula = sequelize.define('categorias_peliculas', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        categoria: {
            type: dataTypes.STRING(25)
        },
        poster: {
            type: dataTypes.STRING(100)
        },
        titulo: {
            type: dataTypes.STRING(50)
        }
    }, {
        tableName: 'categorias_peliculas',
        timestamps: false
    });

    CategoriaPelicula.associate = function(models) {
        CategoriaPelicula.hasMany(models.Peliculas, {
            foreignKey: 'id_categoria_pelicula',
            as: 'categoria_peli'
    })}

    return CategoriaPelicula;
}