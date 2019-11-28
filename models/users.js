'use strict';
module.exports = (sequelize, DataTypes) => {
    var users = sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            },
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING
        }
    }, {});
    users.associate = function(models) {
        // associations can be defined here
    };
    return users;
};