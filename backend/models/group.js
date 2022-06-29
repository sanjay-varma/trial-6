module.exports = (sequelize, DataTypes) => {
    const group = sequelize.define("group", {
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }
    }, {
        freezeTableName: true
    })

    return group;
}