module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("like", {
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {         // Like belongsTo User 1:1
                model: 'users',
                key: 'id'
            }
        },
        postId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        reaction: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
    });
    Like.associate = function(models) {
        Like.belongsTo(models.user, {foreignKey: 'authorId', hooks: true, as: 'author'})
        Like.belongsTo(models.post, {foreignKey: {name: 'postId'}, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactions'})
    };
    return Like;
};