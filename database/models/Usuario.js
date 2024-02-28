module.exports = (sequelize, dataTypes) => {
    let alias= "Usuarios";
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
    
        },
        name: {
            type: dataTypes.STRING,
        },
        photo: {
            type: dataTypes.STRING,
    
        },
        state: {
            type: dataTypes.FLOAT
        },
        idRol: {
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