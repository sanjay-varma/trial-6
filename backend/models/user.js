module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        email: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        avatar: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        freezeTableName: true
    })

    return user;
}