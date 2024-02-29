module.exports = (sequelize, dataTypes) => {
    let alias= "Usuarios";
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
    
        },
        nombre: {
            type: dataTypes.STRING,
        },
        foto: {
            type: dataTypes.STRING,
    
        },
        estado: {
            type: dataTypes.FLOAT
        },
        id_rol: {
            type: dataTypes.INTEGER
        }
    
    
    };
    
    let config =  {
        tableName: "usuarios",
        timestamps: false
    }
    
    
        const Usuario = sequelize.define (alias, cols, config);
    
        return Usuario;
    
    }