module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        biography: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        profileImage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
    });

    return User;
};