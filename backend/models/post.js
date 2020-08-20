module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {         // Post belongsTo User 1:1
                model: 'users',
                key: 'id'
            }
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        like: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dislike: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
    });
    Post.associate = function(models) {
        Post.belongsTo(models.user, {foreignKey: 'authorId', as: 'author'})
    };

    return Post;
};