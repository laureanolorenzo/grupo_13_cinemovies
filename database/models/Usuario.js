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
        },
        email: {
            type: dataTypes.STRING(100)
        },
        contrasena: {
            type: dataTypes.STRING(100)
        }
    
    
    };
    
    let config =  {
        tableName: "usuarios",
        timestamps: false
    }
    
    
    const Usuario = sequelize.define (alias, cols, config);

    Usuario.associate = function(models) {
        Usuario.belongsTo(models.roles, {
            foreignKey: 'id_rol',
            as: 'rol_usuario'
    })}
    
    return Usuario;
    
}