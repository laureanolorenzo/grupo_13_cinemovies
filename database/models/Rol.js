module.exports = (sequelize, dataTypes) => {
    const Rol = sequelize.define('roles', {
        id: {
            autoIncrement: true,
            type: dataTypes.INTEGER,
            primaryKey: true
        },
        tipo: {
            type: dataTypes.STRING(25)
        }
    }, {
        tableName: 'roles',
        timestamps: false
    });

    return Rol;
}