const models = require('../models');
const Post = models.post;
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const like = require('../models/like');

// Create and Save a new post.
exports.createPost = (req, res) => {
    // Validate request
    if (!req.body.content) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const newPost = {
        ...req.body
    };

    // Save post in the database
    Post.create(newPost)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Some error occurred while creating the post." });
        });
};

// Retrieve all posts from the database. (Sends them in descending order, last created first)
exports.findAllPosts = (req, res) => {
    Post.findAll(
        {include: [{all:true}],
        order: Sequelize.literal('rand()'), limit: 1})
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving posts." });
    });
};

// Retrieve latest post from the database.
exports.findLatestPost = (req, res) => {
    Post.findAll({include: 'author', order: [ [ 'createdAt', 'DESC' ]], limit: 1})
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving posts." });
    });
};

// Retrieve one post from the database.
exports.findOne = (req, res) => {
    const postId = req.body.id;

    Post.findByPk(postId)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving post with id=" + postId });
        });
};

// Modify a post from the database.
exports.updatePost = (req, res, next) => {
    // Appel du jwt pour empêcher de supprimer un post depuis un logiciel tiers (e.g. Postman)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const userId = decodedToken.userId;
    const postId = req.params.id;

    // We first look for the post
    Post.findOne({ where: { id: postId } })
        .then((post) => {
            if(userId === post.authorId){
                Post.update(req.body, {where: { id: postId }})
                .then(updatedRows => {
                    if (updatedRows == 1) {
                    res.status(200).json({ message: "Your post was updated successfully." });
                    } else {
                    res.status(400).json({ message: `Cannot update the post with id=${id}. Maybe post was not found or req.body is empty!` });
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: "Error updating the post with id=" + id });
                });
            }
        })
        .catch((err) =>{
            res.status(500).json({ error: "Error while looking for the post"})
        })
};

// Delete a post from database.
exports.deletePost = (req, res) => {
    // Appel du jwt pour empêcher de supprimer un post depuis un logiciel tiers (e.g. Postman)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const userId = decodedToken.userId;
    const postId = req.params.id;

        // We first look for the post
    Post.findOne({ where: { id: postId } })
        .then((post) => {
            // We make sure that the author of the post is the one trying to delete it
            if(userId === post.authorId){
                Post.destroy({ where : {id: postId}})
                    .then(rowDeleted => {  
                        if (rowDeleted == 1) {
                            res.status(200).json({ message: "Post was deleted successfully!"});
                        } else {
                            res.send({ message: `Cannot delete post with id=${postId}. Maybe the post was not found!`});
                        }
                    })
                    .catch(err => {
                    res.status(500).send({ message: "Could not delete post with id=" + postId});
                    });
            } 
            else {
                res.status(401).json({ Error: 'You are not authorized to delete this post'});
            }
        })
        .catch((err) =>{
            res.status(500).json({ error: "Error while looking for the post"})
        })
};

// Find a post and its author.
exports.findUserByPost = (req, res) => {
    const id = req.params.id
    Post.findOne({
        where: {id: id}, include: ['author']
    })
        .then((User) => {
            res.send(User)
        })
        .catch((err) => {
            res.send.json({ error: err})
        })
}

