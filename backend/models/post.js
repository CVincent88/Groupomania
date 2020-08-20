module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Post;
};