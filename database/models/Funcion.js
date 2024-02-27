module.exports = (sequelize, dataTypes) => {
    const Funcion = sequelize.define('funciones', {
        id: {
            autoIncrement: true,
            type: dataTypes.INTEGER,
            primaryKey: true
        },
        id_usuario: {
            type: dataTypes.INTEGER
        },
        id_pelicula: {
            type: dataTypes.INTEGER
        },
        fecha: {
            type: dataTypes.DATE
        },
        sala: {
            type: dataTypes.INTEGER
        },
        precio_boleto: {
            type: dataTypes.DECIMAL
        }
    }, {
        tableName: 'funciones',
        timestamps: false
    });

    return Funcion;
}