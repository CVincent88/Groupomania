module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
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
            allowNull: true,
            defaultValue: 'Parlez un peu de vous !'
        },
        profileImage: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'http://localhost:5000/images/default_profile_picture.jpg'
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
    });
    User.associate = function(models) {
        User.hasMany(models.post, {foreignKey: {name: 'authorId'}, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'publications'}),
        User.hasMany(models.like, {foreignKey: {name: 'authorId'}, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactions', constraints: false})
    };

    return User;
};